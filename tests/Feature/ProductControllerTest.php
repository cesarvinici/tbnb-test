<?php


namespace Tests\Feature;


use App\Models\Product;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        $expectedProduct =[
            "name" => uniqid(),
            "price" => 10.5,
            "quantity" => 11
        ];

        Product::create($expectedProduct);
        $response = $this->json("GET", "/api/product");

        $response->assertStatus(200);
        $response->assertJson(function(AssertableJson $json) use ($expectedProduct) {

            $json->has('data.0', function($json) use ($expectedProduct) {
                $json->where('id', 1)
                    ->where('name', $expectedProduct['name'])
                    ->where('price', $expectedProduct['price'])
                    ->where('quantity', $expectedProduct['quantity'])
                    ->etc();
            });
            $json->etc();
        });
    }

    public function testStore()
    {
        $productToInsert =[
            "name" => uniqid(),
            "price" => 10.5,
            "quantity" => 11
        ];

        $response = $this->json("POST", "/api/product", $productToInsert);
        $response->assertStatus(201);
    }

    public function testStoreWithoutRequiredData()
    {
        $productToInsert =[
            "name" => uniqid(),
            "price" => 10.5,
            "quantity" => 11
        ];

        Product::create($productToInsert);

        $expectedErrorResponse = [
            "name" => [ "The Name '".$productToInsert['name']."' has already been taken."],
        ];

        $response = $this->json("POST", "/api/product", $productToInsert);
        $response->assertJson(function(AssertableJson $json) {
            $json->where('message', "The given data was invalid.")
                ->etc();
        });
        $response->assertJsonFragment($expectedErrorResponse);
        $response->assertStatus(422);

    }

    public function testStoreWithExistingName()
    {
        $productToInsert =[
            "quantity" => 11
        ];

        $expectedErrorResponse = [
            "name" => [ "The Name field is required." ],
            "price" => ["The Produce Price field is required."]
        ];

        $response = $this->json("POST", "/api/product", $productToInsert);
        $response->assertJson(function(AssertableJson $json) {
            $json->where('message', "The given data was invalid.")
                ->etc();
        });
        $response->assertJsonFragment($expectedErrorResponse);
        $response->assertStatus(422);

    }

    public function testBulkStore()
    {
        $productsToInsert =[
            [
                "name" => uniqid(),
                "price" => 10.5,
                "quantity" => 11
            ],
            [
                "name" => uniqid(),
                "price" => 55,
                "quantity" => 2
            ],

        ];

        $response = $this->json("POST", "/api/product", $productsToInsert);
        $response->assertStatus(201);
    }

    public function testBulkStoreWithInvalidData()
    {
        $productsToInsert =[
            [
                "name" => "repetedProduct",
                "price" => 10.5,
                "quantity" => 11
            ],
            [
                "name" => uniqid(),
                "price" => 55,
                "quantity" => 2
            ],

        ];

        Product::create([
            "name" => "repetedProduct",
            "price" => 55,
            "quantity" => 2
        ]);

        $expectedErrorResponse = [
            "0.name" => [ "The Name ".$productsToInsert[0]['name']." has already been taken."],
        ];

        $response = $this->json("POST", "/api/product", $productsToInsert);
        $response->assertJsonFragment($expectedErrorResponse);
        $response->assertStatus(422);
    }

    public function testUpdate()
    {
        $productToInsert =[
            "name" => uniqid(),
            "price" => 10.5,
            "quantity" => 11
        ];

        $productToUpdate = Product::create($productToInsert)->toArray();

        $productToUpdate['price'] = 50;
        $productToUpdate['quantity'] = 1;

        $response = $this->json("PUT", "/api/product/{$productToUpdate['id']}", $productToUpdate);
        $response->assertStatus(200);

        $response->assertJson(function(AssertableJson $json) use ($productToUpdate) {
                $json->where('id', $productToUpdate['id'])
                    ->where('name', $productToUpdate['name'])
                    ->where('price', $productToUpdate['price'])
                    ->where('quantity', $productToUpdate['quantity'])
                    ->etc();

        });
    }

    public function testShow()
    {
        $productToInsert =[
            "name" => uniqid(),
            "price" => 10.5,
            "quantity" => 11
        ];

        $product = Product::create($productToInsert)->toArray();

        $response = $this->json("GET", "/api/product/{$product['id']}");
        $response->assertStatus(200);

        $response->assertJson(function(AssertableJson $json) use ($product) {
            $json->where('id', $product['id'])
                ->where('name', $product['name'])
                ->where('price', $product['price'])
                ->where('quantity', $product['quantity'])
                ->etc();
        });
    }
}
