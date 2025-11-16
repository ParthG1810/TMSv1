import PropTypes from 'prop-types';
// @mui
import { Box, TextField, Stack, Button } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

ProductForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  onNext: PropTypes.func,
};

export default function ProductForm({ data, onChange, onNext }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const isValid = data.name.trim() !== '';

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Product Name"
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
        helperText="Enter the product/ingredient name"
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        value={data.description}
        onChange={(e) => handleChange('description', e.target.value)}
        helperText="Optional description of the product"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
}
