<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{

    public bool $bulkInsert = false;

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

        if ( is_array(json_decode($this->getContent())) ) {
            $this->bulkInsert = true;
            return [
                "*.name"  => "required|string|max:100|unique:products",
                "*.price" => "required|numeric",
                "*.quantity" => "int|min:0",
            ];
        }

        return [
            "name"  => "required|string|max:100|unique:products",
            "price" => "required|numeric",
            "quantity" => "int|min:0",
        ];
    }

    public function attributes()
    {
        if ($this->bulkInsert) {
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

        $name = $this->name ? " '$this->name'" : null;
        return [
            "name" => "Name$name",
            "price" => "Produce Price",
            "quantity" => "Quantity"
        ];
    }
}
