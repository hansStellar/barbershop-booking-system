import { useEffect, useState } from "react";
import { Input } from "@/components/catalyst/input";
import DashboardLayout from "@/components/layouts/dashboard_layout";
import { Button } from "@/components/catalyst/button";
import { Dialog } from "@/components/catalyst/dialog";
import {
  Get_Categories,
  Create_Category,
  Update_Category,
  Delete_Category,
} from "@/utils/Shop_Categories_Functions";

// Add layout to the page
ShopCategoriesPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function ShopCategoriesPage() {
  // 🧠 State Management
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [editCategory, setEditCategory] = useState(null);

  // 🛠️ Event Handlers

  // Handle input change for new category name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input change for editing category name
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Create_Category(newCategory);
      setDialogOpen(false);
      setNewCategory({ name: "" });
      const data = await Get_Categories();
      setCategories(data);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Handle form submission to update an existing category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await Update_Category(editCategory);
      setEditDialogOpen(false);
      setEditCategory(null);
      const data = await Get_Categories();
      setCategories(data);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handle deleting a category by id
  const handleDelete = async (id) => {
    try {
      await Delete_Category(id);
      const data = await Get_Categories();
      setCategories(data);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // 🧩 Effects

  useEffect(() => {
    const fetch_categories = async () => {
      try {
        const data = await Get_Categories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetch_categories();
  }, []);

  // 🖥️ Render
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Shop Categories</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Category</Button>
      </div>

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
                    setEditCategory(category);
                    setEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Add New Category</h3>
          <Input
            placeholder="Category Name"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Category Description"
            name="description"
            value={newCategory.description}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        {editCategory && (
          <form onSubmit={handleUpdate} className="space-y-4 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white">Edit Category</h3>
            <Input
              placeholder="Category Name"
              name="name"
              value={editCategory.name}
              onChange={handleEditChange}
              required
            />
            <Input
              placeholder="Category Description"
              name="description"
              value={editCategory.description}
              onChange={handleEditChange}
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
