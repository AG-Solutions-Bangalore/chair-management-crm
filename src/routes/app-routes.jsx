import Login from "@/app/auth/login";
import BomList from "@/app/bom/bom";
import Home from "@/app/bom/home/home";
import ComponentForm from "@/app/component/component-form";
import ComponentList from "@/app/component/component-list";
import NotFound from "@/app/errors/not-found";
import OrderForm from "@/app/order/order-form";
import OrderList from "@/app/order/order-list";
import OrderProductionForm from "@/app/order/order-production-form";
import ProductList from "@/app/product/product-list";
import ProductionForm from "@/app/production/production-form";
import ProductionList from "@/app/production/production-list";
import PurchaseProductForm from "@/app/purchase-product/purchase-product-form";
import PurchaseProductList from "@/app/purchase-product/purchase-product-list";
import PurchaseComponentList from "@/app/purchasecomponent/purchas-component-list";
import PurchaseComponentForm from "@/app/purchasecomponent/purchase-component-form";
import Settings from "@/app/setting/setting";
import VendorForm from "@/app/vendor/vendor-form";
import VendorList from "@/app/vendor/vendor-list";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import ProductionEdit from "../app/production/production-edit";
import ProductStockReport from "@/app/report/product/productstock-report";
import ComponentStockReport from "@/app/report/component/componentstock-report";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/home"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/bom"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BomList />
              </Suspense>
            }
          />
          <Route
            path="/product"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ProductList />
              </Suspense>
            }
          />
          <Route
            path="/component"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentList />
              </Suspense>
            }
          />
          <Route
            path="/component/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/component/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/bom"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BomList />
              </Suspense>
            }
          />
          <Route
            path="/vendor"
            element={
              <Suspense fallback={<LoadingBar />}>
                <VendorList />
              </Suspense>
            }
          />
          <Route
            path="/vendor/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <VendorForm />
              </Suspense>
            }
          />
          <Route
            path="/vendor/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <VendorForm />
              </Suspense>
            }
          />
          <Route
            path="/order"
            element={
              <Suspense fallback={<LoadingBar />}>
                <OrderList />
              </Suspense>
            }
          />
          <Route
            path="/order/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <OrderForm />
              </Suspense>
            }
          />
          <Route
            path="/order/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <OrderForm />
              </Suspense>
            }
          />
          <Route
            path="/purchase-product"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseProductList />
              </Suspense>
            }
          />
          <Route
            path="/purchase-product/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseProductForm />
              </Suspense>
            }
          />
          <Route
            path="/purchase-product/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseProductForm />
              </Suspense>
            }
          />
          <Route
            path="/purchase-component"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseComponentList />
              </Suspense>
            }
          />
          <Route
            path="/purchase-component/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/purchase-component/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PurchaseComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/order/production/create/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <OrderProductionForm />
              </Suspense>
            }
          />
          <Route
            path="/production"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ProductionList />
              </Suspense>
            }
          />
          <Route
            path="/production/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ProductionForm />
              </Suspense>
            }
          />
          <Route
            path="/report/productstock"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ProductStockReport />
              </Suspense>
            }
          />
          <Route
            path="/report/componentstock"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentStockReport />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
