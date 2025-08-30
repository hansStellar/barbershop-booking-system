import { useEffect, useState } from "react";

// Dashboard Layout
import DashboardLayout from "@/components/layouts/dashboard_layout";

// Catalyst
import { Button } from "@/components/catalyst/button";
import { Dialog } from "@/components/catalyst/dialog";
import { Input } from "@/components/catalyst/input";

// Categories product functions
import {
  Get_Categories,
  Create_Category,
  Update_Category,
  Delete_Category,
} from "@/utils/Shop_Categories_Functions.js";
import {
  Delete_Products,
  Get_Products_By_Category_ID,
} from "@/utils/Shop_Products_Functions";

ShopCategoriesPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function ShopCategoriesPage() {
  // ======================
  // 🧠 State Management
  // ======================
  const [categories, set_categories] = useState([]);
  const [show_create_modal, set_show_create_modal] = useState(false);
  const [show_edit_modal, set_show_edit_modal] = useState(false);
  const [new_category, set_new_category] = useState({
    name: "",
    description: "",
  });
  const [edit_category, set_edit_category] = useState(null);

  // ======================
  // 🛠️ Event Handlers
  // ======================

  // Handle input change for new category name and description
  const handle_create_change = (e) => {
    const { name, value } = e.target;
    set_new_category((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input change for editing category name and description
  const handle_edit_change = (e) => {
    const { name, value } = e.target;
    set_edit_category((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new category
  const handle_create_submit = async (e) => {
    e.preventDefault();
    try {
      await Create_Category(new_category);
      set_show_create_modal(false);
      set_new_category({ name: "", description: "" });
      const data = await Get_Categories();
      set_categories(data);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Handle form submission to update an existing category
  const handle_edit_submit = async (e) => {
    e.preventDefault();
    try {
      await Update_Category(edit_category);
      set_show_edit_modal(false);
      set_edit_category(null);
      const data = await Get_Categories();
      set_categories(data);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handle deleting a category by id
  const handle_delete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? If there are any products linked to it, they will also be permanently deleted",
      )
    )
      return;
    try {
      const products_with_same_id = await Get_Products_By_Category_ID(id);
      const delete_products_with_same_id = await Delete_Products(
        products_with_same_id.data,
      );
      await Delete_Category(id);
      const data = await Get_Categories();
      set_categories(data);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ======================
  // 🧩 Effects
  // ======================

  useEffect(() => {
    const fetch_categories = async () => {
      try {
        const data = await Get_Categories();
        set_categories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetch_categories();
  }, []);

  // ======================
  // 🖥️ Render
  // ======================
  return (
    <div className="p-4">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Shop Categories</h2>
        <Button onClick={() => set_show_create_modal(true)}>
          Add Category
        </Button>
      </div>

      {/* Categories */}
      {Array.isArray(categories) && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-600 p-4 rounded-lg bg-gray-800"
            >
              <h3 className="font-semibold text-white">{category.name}</h3>
              <div className="flex justify-between mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    set_edit_category(category);
                    set_show_edit_modal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handle_delete(category.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No categories found.</p>
      )}

      {/* Create Categorie Modal */}
      <Dialog
        open={show_create_modal}
        onClose={() => {
          set_show_create_modal(false);
          set_new_category({ name: "", description: "" });
        }}
      >
        <form
          onSubmit={handle_create_submit}
          className="space-y-4 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white">Add New Category</h3>
          <Input
            placeholder="Category Name"
            name="name"
            value={new_category.name}
            onChange={handle_create_change}
            required
          />
          <Input
            placeholder="Category Description"
            name="description"
            value={new_category.description}
            onChange={handle_create_change}
          />
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Dialog Modal */}
      <Dialog
        open={show_edit_modal}
        onClose={() => {
          set_show_edit_modal(false);
          set_edit_category(null);
        }}
      >
        {edit_category && (
          <form
            onSubmit={handle_edit_submit}
            className="space-y-4 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-white">Edit Category</h3>
            <Input
              placeholder="Category Name"
              name="name"
              value={edit_category.name}
              onChange={handle_edit_change}
              required
            />
            <Input
              placeholder="Category Description"
              name="description"
              value={edit_category.description}
              onChange={handle_edit_change}
            />
            <div className="flex justify-end">
              <Button type="submit">Update</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
