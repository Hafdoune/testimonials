<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\TestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialCollection;
use App\Http\Resources\TestimonialResource;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    public function index() {
        if (Auth::user()) {
            $testimonials = Testimonial::orderBy('order')->get();            
        } else {
            $testimonials = Testimonial::where('status', 1)->orderBy('order')->get();    
        }

        // return new TestimonialCollection(Testimonial::all());
        return TestimonialResource::collection($testimonials);
    }

    public function getTestimonial(Request $request) {
        $testimonial = Testimonial::where('id', $request->id)->first();    
        // return new TestimonialCollection(Testimonial::all());
        return $testimonial;
    }

    public function store(TestimonialRequest $request) {
        $data = $request->validated();

        $nb_testimonials = Testimonial::all()->count();

        $testimonial = Testimonial::create([
            'title' => $data['title'],
            'message' => $data['message'],
            'title' => $data['title'],
            'order' => $nb_testimonials + 1,
            'status' => 0,
        ]);

        if (isset($data['image'])) {
            $file= $data['image'];
            $filename = Str::random(20).$file->getClientOriginalName();
            $file->move(public_path('storage'), $filename);
            $testimonial->update([
                'image' => $filename
            ]);
        }
        
        return $testimonial;
    }

    public function update(UpdateTestimonialRequest $request){
        $data = $request->validated();

        $testimonial = Testimonial::where('id', $request->id)->first();

        if ($request->file('image')) {
            $file= $data['image'];
            $filename = Str::random(20).$file->getClientOriginalName();
            $file->move(public_path('storage'), $filename);

            if ($testimonial->image) {
                $path = public_path('storage').'/'.$testimonial->image;
                if (file_exists($path)) {
                    unlink($path);
                }
            }
            $testimonial->update([
                'image' => $filename
            ]);
        }

        $testimonial->update([
            'title' => $data['title'],
            'message' => $data['message'],
            'status' => $data['status'],
        ]);

        return new TestimonialResource($testimonial);
    }

    public function updateOrder (Request $request) {

        foreach ($request->all() as $index => $item) {
            $testimonial = Testimonial::find($item['id']);

            if ($testimonial) {
                $testimonial->update([
                    'order' => $index
                ]);
            }
        }
        return;
    }
}
