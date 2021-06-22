<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules =  [
            "*.id" => "required",
            "*.price" => "required|numeric",
            "*.quantity" => "int|min:0",
        ];

        foreach ($this->all() as $key => $product) {

            if (!isset($product['id'])) {
                continue;
            }

            $rules["$key.name"] = "required|string|max:100|unique:products,name,{$product['id']}";
        }

        return $rules;
    }

    public function attributes()
    {

        $attributes = [];

        foreach ($this->all() as $key => $product) {

            $name = isset($product['name']) ? $product['name'] : null;
            $attributes["$key.id"] = "ID";
            $attributes["$key.name"] = "Name $name";
            $attributes["$key.price"]  = "Product Price";
            $attributes["$key.quantity"]  = "Quantity";
        }

        return $attributes;

    }
}
