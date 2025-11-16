import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const PACKAGE_SIZES = ['g', 'kg', 'ml', 'l', 'pcs'];

// ----------------------------------------------------------------------

VendorForm.propTypes = {
  vendors: PropTypes.array,
  onChange: PropTypes.func,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

export default function VendorForm({ vendors, onChange, onNext, onBack }) {
  const handleVendorChange = (index, field, value) => {
    const updated = vendors.map((vendor, i) => {
      if (i === index) {
        return { ...vendor, [field]: value };
      }
      return vendor;
    });
    onChange(updated);
  };

  const handleAddVendor = () => {
    if (vendors.length < 3) {
      onChange([
        ...vendors,
        {
          vendor_name: '',
          price: '',
          weight: '',
          package_size: 'g',
          is_default: false,
        },
      ]);
    }
  };

  const handleRemoveVendor = (index) => {
    if (vendors.length > 1) {
      const updated = vendors.filter((_, i) => i !== index);
      // If removed vendor was default, make first vendor default
      if (vendors[index].is_default && updated.length > 0) {
        updated[0].is_default = true;
      }
      onChange(updated);
    }
  };

  const handleSetDefault = (index) => {
    const updated = vendors.map((vendor, i) => ({
      ...vendor,
      is_default: i === index,
    }));
    onChange(updated);
  };

  const isValid = vendors.every(
    (v) =>
      v.vendor_name.trim() !== '' &&
      v.price > 0 &&
      v.weight > 0 &&
      v.package_size !== ''
  );

  return (
    <Stack spacing={3}>
      {vendors.map((vendor, index) => (
        <Card key={index} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Vendor {index + 1}</Typography>
              <Box>
                {vendor.is_default ? (
                  <Chip label="Default" color="primary" size="small" sx={{ mr: 1 }} />
                ) : (
                  <Button
                    size="small"
                    onClick={() => handleSetDefault(index)}
                    sx={{ mr: 1 }}
                  >
                    Set as Default
                  </Button>
                )}
                {vendors.length > 1 && (
                  <IconButton onClick={() => handleRemoveVendor(index)} color="error">
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Vendor Name"
              value={vendor.vendor_name}
              onChange={(e) => handleVendorChange(index, 'vendor_name', e.target.value)}
              required
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              <TextField
                type="number"
                label="Price"
                value={vendor.price}
                onChange={(e) => handleVendorChange(index, 'price', e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                type="number"
                label="Weight"
                value={vendor.weight}
                onChange={(e) => handleVendorChange(index, 'weight', e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                select
                label="Unit"
                value={vendor.package_size}
                onChange={(e) => handleVendorChange(index, 'package_size', e.target.value)}
                required
              >
                {PACKAGE_SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </Card>
      ))}

      {vendors.length < 3 && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddVendor}
        >
          Add Another Vendor
        </Button>
      )}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button variant="outlined" onClick={onBack} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
