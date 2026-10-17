import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { MenuHubPage } from '../pages/MenuHubPage';
import { BranchMenuPage } from '../pages/BranchMenuPage';
import { BranchSpacePage } from '../pages/BranchSpacePage';
import { ReservationPage } from '../pages/ReservationPage';
import { BlogListPage } from '../pages/BlogListPage';
import { BlogDetailPage } from '../pages/BlogDetailPage';
import { ContactPage } from '../pages/ContactPage';
import { LegalPage } from '../pages/LegalPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ve-chung-toi" element={<AboutPage />} />
        <Route path="thuc-don" element={<MenuHubPage />} />
        <Route
          path="thuc-don-lac-thai-mac-thi-buoi"
          element={<BranchMenuPage branchId="mac-thi-buoi" />}
        />
        <Route
          path="thuc-don-lac-thai-xuan-thuy"
          element={<BranchMenuPage branchId="xuan-thuy" />}
        />
        <Route
          path="khong-gian-lac-thai-mac-thi-buoi"
          element={<BranchSpacePage branchId="mac-thi-buoi" />}
        />
        <Route
          path="khong-gian-lac-thai-xuan-thuy-thao-dien"
          element={<BranchSpacePage branchId="xuan-thuy" />}
        />
        <Route path="dat-ban" element={<ReservationPage />} />
        <Route path="blog" element={<BlogListPage />} />
        <Route path="tin-tuc/:slug" element={<BlogDetailPage />} />
        <Route path="lien-he" element={<ContactPage />} />
        <Route
          path="chinh-sach"
          element={<LegalPage docType="chinh-sach" />}
        />
        <Route path="quy-dinh" element={<LegalPage docType="quy-dinh" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
