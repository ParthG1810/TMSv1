import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

RecipeIngredientsTable.propTypes = {
  ingredients: PropTypes.array,
  products: PropTypes.array,
  onChange: PropTypes.func,
};

export default function RecipeIngredientsTable({ ingredients, products, onChange }) {
  const handleAddIngredient = () => {
    onChange([
      ...ingredients,
      {
        product_id: '',
        quantity: '',
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    onChange(updated);
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;

    const defaultVendor = product.vendors?.find((v) => v.is_default) || product.vendors?.[0];
    return defaultVendor;
  };

  const calculateIngredientCost = (ingredient) => {
    if (!ingredient.product_id || !ingredient.quantity) return 0;

    const vendor = getProductPrice(ingredient.product_id);
    if (!vendor) return 0;

    return (vendor.price * ingredient.quantity) / vendor.weight;
  };

  const totalCost = ingredients.reduce((sum, ing) => sum + calculateIngredientCost(ing), 0);

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.map((ingredient, index) => {
            const vendor = getProductPrice(ingredient.product_id);
            const cost = calculateIngredientCost(ingredient);

            return (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    value={ingredient.product_id}
                    onChange={(e) => handleIngredientChange(index, 'product_id', e.target.value)}
                    size="small"
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </TableCell>
                <TableCell align="right">{vendor?.package_size || 'N/A'}</TableCell>
                <TableCell align="right">${cost.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleRemoveIngredient(index)} color="error">
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddIngredient}
        >
          Add Ingredient
        </Button>

        <Typography variant="h6">Total Cost: ${totalCost.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
}
