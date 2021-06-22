<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkUpdateProductRequest;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     */
    public function index(): JsonResponse
    {
        return response()->json(Product::all());
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreProductRequest $request
     * @return JsonResponse
     */
    public function store(StoreProductRequest $request): JsonResponse
    {

        if ($request->bulkInsert) {
            return $this->bulkStore($request);
        }

       (new Product)->create($request->all());

        return response()->json(null, 201);
    }


    /**
     * @param StoreProductRequest $request
     * @return JsonResponse
     */
    public function bulkStore(StoreProductRequest $request): JsonResponse
    {
        foreach ($request->all() as $singleRequest) {
            (new Product)->create($singleRequest);
        };

        return response()->json(null, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Product $product
     * @return JsonResponse
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateProductRequest $request
     * @param Product $product
     * @return JsonResponse
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->all());
        return response()->json($product);
    }

    public function bulkUpdate(BulkUpdateProductRequest $request)
    {


        $ids = [];
        /** @var Request $update */
        foreach ($request->all() as $productForUpdate) {
            $ids[] = $productForUpdate['id'];
             $product = Product::find($productForUpdate['id']);
             $product->update($productForUpdate);
        }


        return response()->json(Product::find($ids));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Product $product
     * @return JsonResponse
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json([], 204);
    }
}
