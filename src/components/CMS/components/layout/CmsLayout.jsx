// components/layout/CmsLayout.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CmsProvider, useCmsContext } from "../../contexts/CmsContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BackToTop from "./BackToTop";
import { fetchMyPermissions } from "../../../../manageApi/store/authSlice";

const CmsLayoutContent = ({ children }) => {
  const { sidebarCollapsed, mobileSidebarOpen } = useCmsContext();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      dispatch(fetchMyPermissions());
    }
  }, [dispatch, user, token]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300
        ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Topbar />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pt-16 pb-6 bg-gray-300 transition-all duration-300">
          <div className="max-w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 mx-auto w-full">
              {children}
           
          </div>
          <BackToTop />
        </main>
      </div>
    </div>
  );
};

const CmsLayout = ({ children }) => (
   <CmsProvider>
    <CmsLayoutContent>{children}</CmsLayoutContent>
  </CmsProvider>
);

export default CmsLayout;
