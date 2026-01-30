import Login from "@/app/auth/login";
import BannerList from "@/app/banner/banner-list";
import CreateBanner from "@/app/banner/create-banner";
import EditBanner from "@/app/banner/edit-banner";
import BlogList from "@/app/blog/blog-list";
import CreateBlog from "@/app/blog/create-blog";
import BomList from "@/app/bom/bom";
import NotFound from "@/app/errors/not-found";
import FaqForm from "@/app/faq/create-faq";
import FaqList from "@/app/faq/faq-list";
import GalleryList from "@/app/gallery/gallery-list";
import LectureYoutubeForm from "@/app/lecture-youtube/lecture-youtube-form";
import LetureYoutubeList from "@/app/lecture-youtube/lecture-youtube-list";
import NewsLetter from "@/app/newsletter/news-letter";
import PopupList from "@/app/popup/popup";
import Settings from "@/app/setting/setting";
import SidePopupList from "@/app/sidepopup/sidepopup-list";
import StudentCertificate from "@/app/student/student-certificate";
import StudentForm from "@/app/student/student-form";
import StudentMap from "@/app/student/student-map";
import StudentOfficeImage from "@/app/student/student-officeimage";
import StudentRecentPassOut from "@/app/student/student-recentpassout";
import StudentStory from "@/app/student/student-story";
import StudentTestimonial from "@/app/student/student-testimonial";
import StudenTop from "@/app/student/student-top";
import StudentYoutube from "@/app/student/student-youtube";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import EditBlog from "../app/blog/edit-blog";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import Home from "@/app/home/home";
import ProductList from "@/app/product/product-list";

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
            path="/bom"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BomList />
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
