import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Card,
  Button,
  Container,
  Typography,
  TextField,
  Stack,
} from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
// sections
import RecipeIngredientsTable from '../../../sections/@dashboard/recipe/RecipeIngredientsTable';

// ----------------------------------------------------------------------

RecipeCreationPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RecipeCreationPage() {
  const router = useRouter();
  const { id } = router.query;
  const { themeStretch } = useSettingsContext();

  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    ingredients: [],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchRecipe = async (recipeId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`
      );
      const result = await response.json();

      if (result.success) {
        setRecipeData(result.data);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setRecipeData({ ...recipeData, [field]: value });
  };

  const handleIngredientsChange = (ingredients) => {
    setRecipeData({ ...recipeData, ingredients });
  };

  const handleSubmit = async () => {
    if (!recipeData.name || recipeData.ingredients.length === 0) {
      alert('Please fill in recipe name and add at least one ingredient');
      return;
    }

    try {
      setLoading(true);
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/recipes`;

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/recipes/list');
      } else {
        console.error('Error saving recipe:', result.error);
        alert('Error saving recipe: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/recipes/list');
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={isEdit ? 'Edit Recipe' : 'Create New Recipe'}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Recipes', href: '/dashboard/recipes/list' },
          { name: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Recipe Information</Typography>

          <TextField
            fullWidth
            label="Recipe Name"
            value={recipeData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={recipeData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Ingredients
          </Typography>

          <RecipeIngredientsTable
            ingredients={recipeData.ingredients}
            products={products}
            onChange={handleIngredientsChange}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<Iconify icon="eva:save-fill" />}
            >
              {loading ? 'Saving...' : 'Save Recipe'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
