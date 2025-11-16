import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Card,
  Step,
  Stepper,
  Container,
  StepLabel,
  Typography,
} from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ProductForm from '../../../sections/@dashboard/product/ProductForm';
import VendorForm from '../../../sections/@dashboard/product/VendorForm';
import ProductReview from '../../../sections/@dashboard/product/ProductReview';

// ----------------------------------------------------------------------

const STEPS = ['Product Information', 'Vendor Details', 'Review'];

// ----------------------------------------------------------------------

ProductEntryPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProductEntryPage() {
  const router = useRouter();
  const { id } = router.query;
  const { themeStretch } = useSettingsContext();

  const [activeStep, setActiveStep] = useState(0);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    vendors: [
      {
        vendor_name: '',
        price: '',
        weight: '',
        package_size: 'g',
        is_default: true,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
      );
      const result = await response.json();

      if (result.success) {
        setProductData(result.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleProductChange = (data) => {
    setProductData({ ...productData, ...data });
  };

  const handleVendorChange = (vendors) => {
    setProductData({ ...productData, vendors });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products`;

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/products/list');
      } else {
        console.error('Error saving product:', result.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProductForm
            data={productData}
            onChange={handleProductChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <VendorForm
            vendors={productData.vendors}
            onChange={handleVendorChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ProductReview
            data={productData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit={isEdit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={isEdit ? 'Edit Product' : 'Add New Product'}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Products', href: '/dashboard/products/list' },
          { name: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Card sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </Card>
    </Container>
  );
}
