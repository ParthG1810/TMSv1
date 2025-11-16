import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Stack,
  Button,
  Typography,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

ProductReview.propTypes = {
  data: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
};

export default function ProductReview({ data, onBack, onSubmit, loading, isEdit }) {
  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Information
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Product Name:</strong>
              </TableCell>
              <TableCell>{data.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Description:</strong>
              </TableCell>
              <TableCell>{data.description || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vendor Information
        </Typography>
        <Table>
          <TableBody>
            {data.vendors.map((vendor, index) => (
              <TableRow key={index}>
                <TableCell>
                  <strong>{vendor.vendor_name}</strong>
                  {vendor.is_default && (
                    <Chip label="Default" color="primary" size="small" sx={{ ml: 1 }} />
                  )}
                </TableCell>
                <TableCell align="right">
                  ${vendor.price} / {vendor.weight} {vendor.package_size}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          startIcon={<Iconify icon="eva:save-fill" />}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
        </Button>
      </Stack>
    </Stack>
  );
}
