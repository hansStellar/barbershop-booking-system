import React, { useEffect, useState } from "react";

// Dashboard Layout
import DashboardLayout from "@/components/layouts/dashboard_layout";

// Catalyst
import { Button } from "@/components/catalyst/button";
import { Dialog } from "@/components/catalyst/dialog";
import { Input } from "@/components/catalyst/input";

// Shop product functions
import {
  Get_All_Products,
  Create_Product,
  Update_Product,
  Delete_Product,
} from "@/utils/Shop_Products_Functions.js";

ShopProducts.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function ShopProducts() {
  // 🧠 State Management
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const [show_create_modal, set_show_create_modal] = useState(false);
  const [show_edit_modal, set_show_edit_modal] = useState(false);
  const [create_form, set_create_form] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
  });
  const [edit_form, set_edit_form] = useState(null);
  const [error, set_error] = useState("");

  // Functions
  const fetch_products = async () => {
    set_loading(true);
    try {
      const data = await Get_All_Products();
      set_products(data.products || data);
    } catch (err) {
      console.log(err);
    }
    set_loading(false);
  };

  const handle_create_change = (e) => {
    set_create_form({ ...create_form, [e.target.name]: e.target.value });
  };

  const handle_edit_change = (e) => {
    set_edit_form({ ...edit_form, [e.target.name]: e.target.value });
  };

  const handle_create_submit = async (e) => {
    e.preventDefault();
    try {
      await Create_Product(create_form);
      set_show_create_modal(false);
      set_create_form({
        name: "",
        price: "",
        description: "",
        category_id: "",
      });
      fetch_products();
    } catch (err) {
      console.log(err);
    }
  };

  const handle_edit_submit = async (e) => {
    e.preventDefault();
    try {
      await Update_Product(edit_form.id, {
        id: edit_form.id,
        name: edit_form.name,
        price: edit_form.price,
        description: edit_form.description,
        category_id: edit_form.category_id,
      });
      set_show_edit_modal(false);
      set_edit_form({
        id: "",
        name: "",
        price: "",
        description: "",
        category_id: "",
      });
      fetch_products();
    } catch (err) {
      set_error("Failed to update product.");
    }
  };

  const handle_delete = async (product_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await Delete_Product(product_id);
      fetch_products();
    } catch (err) {
      console.log(err);
    }
  };

  // UseEffect
  useEffect(() => {
    fetch_products();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Shop Categories</h2>
        <Button onClick={() => set_show_create_modal(true)}>
          Create Product
        </Button>
      </div>

      {Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-600 p-4 rounded-lg bg-gray-800"
            >
              <h3 className="font-semibold text-white">{product.name}</h3>
              <div className="flex justify-between mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    set_edit_form(product);
                    set_show_edit_modal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handle_delete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No products found.</p>
      )}
      {/* Create Modal */}
      <Dialog
        open={show_create_modal}
        onClose={() => set_show_create_modal(false)}
      >
        <form onSubmit={handle_create_submit} className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Add New Product</h3>
          <Input
            placeholder="Product Name"
            name="name"
            value={create_form.name}
            onChange={handle_create_change}
            required
          />
          <Input
            placeholder="Price"
            name="price"
            value={create_form.price}
            onChange={handle_create_change}
            required
          />
          <Input
            placeholder="Product Description"
            name="description"
            value={create_form.description}
            onChange={handle_create_change}
          />
          <Input
            placeholder="Category ID"
            name="category_id"
            value={create_form.category_id}
            onChange={handle_create_change}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => set_show_create_modal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={show_edit_modal} onClose={() => set_show_edit_modal(false)}>
        {edit_form && (
          <form onSubmit={handle_edit_submit} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Edit Product</h3>
            <Input
              placeholder="Product Name"
              name="name"
              value={edit_form.name}
              onChange={handle_edit_change}
              required
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={edit_form.price}
              onChange={handle_edit_change}
              required
            />
            <Input
              placeholder="Product Description"
              name="description"
              value={edit_form.description}
              onChange={handle_edit_change}
            />
            <Input
              placeholder="Category ID"
              name="category_id"
              value={edit_form.category_id}
              onChange={handle_edit_change}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => set_show_edit_modal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
