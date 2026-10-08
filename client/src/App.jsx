import React, { useState, useEffect } from 'react';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BatchAnnouncement } from './components/BatchAnnouncement';
import { ProgramOverview } from './components/ProgramOverview';
import { StudentGuideSection } from './components/StudentGuideSection';
import { WhatStudentsLearn } from './components/WhatStudentsLearn';
import { RoadmapTimeline } from './components/RoadmapTimeline';
import { DeploymentSection } from './components/DeploymentSection';
import { GitHubWorkflow } from './components/GitHubWorkflow';
import { PricingSection } from './components/PricingSection';
import { WhatsAppSection } from './components/WhatsAppSection';
import { HowItWorks } from './components/HowItWorks';
import { RegistrationForm } from './components/RegistrationForm';
import { CashfreeModal } from './components/CashfreeModal';
import { PaymentStatusView } from './components/PaymentStatusView';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CertificateView } from './components/CertificateView';
import { StudentGuideView } from './components/StudentGuideView';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { LoginModal } from './components/LoginModal';

export default function App() {
  // Current view mode: 'landing' | 'payment_status' | 'student_dashboard' | 'admin_dashboard' | 'certificate_view'
  const [currentView, setCurrentView] = useState('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Public config state
  const [publicConfig, setPublicConfig] = useState({
    whatsapp_group_url: 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP',
    batch: {
      name: 'Batch 1',
      title: '3-Month Full Stack Development Internship',
      start_notice: 'Batch 1 starts within the next 10 days.'
    }
  });

  // Cashfree Order Checkout Modal state
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Payment Status state
  const [paymentResult, setPaymentResult] = useState({
    orderId: '',
    status: 'PENDING'
  });

  // Logged-in / viewed student ID for portal
  const [activeStudentId, setActiveStudentId] = useState(
    localStorage.getItem('skyrovix_student_id') || ''
  );

  // Viewed certificate ID
  const [activeCertId, setActiveCertId] = useState('');

  // Fetch live public config
  const fetchPublicConfig = async () => {
    try {
      const res = await fetch('/api/public/config');
      const data = await res.json();
      if (data.success) {
        setPublicConfig(data);
      }
    } catch (err) {
      console.warn('Using default public config:', err);
    }
  };

  useEffect(() => {
    fetchPublicConfig();

    const syncRouteFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const orderIdParam = params.get('order_id');
      const path = window.location.pathname;

      if (orderIdParam || path.includes('/payment/')) {
        const detectedStatus = path.includes('/success') ? 'SUCCESS' : path.includes('/failed') ? 'FAILED' : 'PENDING';
        setPaymentResult({
          orderId: orderIdParam || '',
          status: detectedStatus
        });
        setCurrentView('payment_status');
      } else if (path.startsWith('/verify/') || path === '/verify' || path === '/certificate' || path === '/verify-certificate' || params.get('view') === 'certificate') {
        const certId = path.startsWith('/verify/') ? path.replace('/verify/', '') : (params.get('id') || '');
        setActiveCertId(certId);
        setCurrentView('certificate_view');
      } else if (path.startsWith('/admin')) {
        setCurrentView('admin_dashboard');
      } else if (path === '/guide' || path.startsWith('/guide') || path === '/training' || path.startsWith('/training')) {
        setCurrentView('guide_page');
      } else {
        const studentIdParam = params.get('studentId') || params.get('student_id');
        if (studentIdParam) {
          setActiveStudentId(studentIdParam);
          setCurrentView('student_dashboard');
        } else if (path.startsWith('/dashboard')) {
          const saved = localStorage.getItem('skyrovix_student_id');
          if (saved) {
            setActiveStudentId(saved);
            setCurrentView('student_dashboard');
          } else {
            try {
              window.history.pushState({}, '', '/');
            } catch (e) {}
            setCurrentView('landing');
            setIsLoginOpen(true);
          }
        } else {
          setCurrentView('landing');
        }
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  // Handlers for scroll and modal triggers
  const scrollToApply = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById('register');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('register');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Called when registration form submits successfully and creates Cashfree order
  const handleOrderCreated = (orderData) => {
    setCheckoutOrder(orderData);
    setIsCheckoutOpen(true);
  };

  // When student was already registered and paid
  const handleAlreadyConfirmed = (data) => {
    if (data.already_confirmed && (data.is_paid || data.payment_status === 'PAID')) {
      if (data.student_id) {
        localStorage.setItem('skyrovix_student_id', data.student_id);
        setActiveStudentId(data.student_id);
        setCurrentView('student_dashboard');
      }
    } else if (data.order_id) {
      handleOrderCreated(data);
    }
  };

  // Payment completed successfully in Cashfree checkout
  const handlePaymentSuccess = (verifiedData) => {
    setIsCheckoutOpen(false);
    if (verifiedData.student?.id) {
      localStorage.setItem('skyrovix_student_id', verifiedData.student.id);
      setActiveStudentId(verifiedData.student.id);
    }
    setPaymentResult({
      orderId: verifiedData.order_id,
      status: 'SUCCESS'
    });
    setCurrentView('payment_status');
  };

  // Payment failed
  const handlePaymentFailed = (failedData) => {
    setIsCheckoutOpen(false);
    setPaymentResult({
      orderId: checkoutOrder?.order_id || '',
      status: 'FAILED'
    });
    setCurrentView('payment_status');
  };

  // Payment pending
  const handlePaymentPending = (pendingData) => {
    setIsCheckoutOpen(false);
    setPaymentResult({
      orderId: checkoutOrder?.order_id || '',
      status: 'PENDING'
    });
    setCurrentView('payment_status');
  };

  // Open User Dashboard
  const handleOpenStudentPortal = (studentId) => {
    const saved = localStorage.getItem('skyrovix_student_id');
    const idToUse = studentId || activeStudentId || saved;
    if (idToUse) {
      setActiveStudentId(idToUse);
      try {
        window.history.pushState({}, '', `/dashboard?studentId=${idToUse}`);
      } catch (e) {}
      setCurrentView('student_dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  // Verify certificate
  const handleOpenCertificate = (certId = '') => {
    setActiveCertId(certId || '');
    try {
      window.history.pushState({}, '', certId ? `/verify/${certId}` : '/certificate');
    } catch (e) {}
    setCurrentView('certificate_view');
  };

  const whatsappUrl = publicConfig?.whatsapp_group_url;

  // Dedicated Fullscreen Student Dashboard
  if (currentView === 'student_dashboard') {
    return (
      <>
        <StudentDashboard
          studentId={activeStudentId}
          onLogout={() => {
            localStorage.removeItem('skyrovix_student_id');
            localStorage.removeItem('skyrovix_auth_token');
            setActiveStudentId('');
            try {
              window.history.pushState({}, '', '/');
            } catch (e) {}
            setCurrentView('landing');
          }}
          onVerifyCert={handleOpenCertificate}
          onTriggerPayment={handleOrderCreated}
        />
        <CashfreeModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          orderDetails={checkoutOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
          onPaymentPending={handlePaymentPending}
        />
      </>
    );
  }

  // Dedicated Fullscreen Admin Dashboard
  if (currentView === 'admin_dashboard') {
    return (
      <AdminDashboard
        onLogout={() => {
          try {
            window.history.pushState({}, '', '/');
          } catch (e) {}
          setCurrentView('landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 w-full max-w-full overflow-x-hidden">
      
      {/* Universal Navigation (Landing & Public pages) */}
      <Navbar
        onOpenApply={scrollToApply}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={() => handleOpenStudentPortal()}
        onOpenCertificate={() => handleOpenCertificate('')}
        onOpenAdmin={() => {
          try {
            window.history.pushState({}, '', '/admin/dashboard');
          } catch (e) {}
          setCurrentView('admin_dashboard');
        }}
        onOpenGuide={() => {
          try {
            window.history.pushState({}, '', '/guide');
          } catch (e) {}
          setCurrentView('guide_page');
        }}
        whatsappUrl={whatsappUrl}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'landing' && (
          <>
            {/* 1. Hero Section */}
            <Hero 
              onOpenApply={scrollToApply} 
              onOpenGuide={() => {
                try {
                  window.history.pushState({}, '', '/guide');
                } catch (e) {}
                setCurrentView('guide_page');
              }}
              whatsappUrl={whatsappUrl} 
            />

            {/* 2. Batch 1 Announcement Card */}
            <BatchAnnouncement onOpenApply={scrollToApply} whatsappUrl={whatsappUrl} />

            {/* 3. Program Overview */}
            <ProgramOverview onOpenApply={scrollToApply} />

            {/* 4. What Students Will Learn */}
            <WhatStudentsLearn onOpenApply={scrollToApply} />

            {/* 5. 3-Month Roadmap */}
            <RoadmapTimeline onOpenApply={scrollToApply} />

            {/* 6. Deployment Section (BUILD -> TEST -> DEPLOY -> SHARE) */}
            <DeploymentSection onOpenApply={scrollToApply} />

            {/* 8. GitHub Workflow Section */}
            <GitHubWorkflow onOpenApply={scrollToApply} />

            {/* 9. Transparent Pricing Section */}
            <PricingSection onOpenApply={scrollToApply} />

            {/* 10. How It Works (5-Step Process) */}
            <HowItWorks onOpenApply={scrollToApply} />

            {/* 11. Official WhatsApp Group Section */}
            <WhatsAppSection whatsappUrl={whatsappUrl} />

            {/* 12. Registration Form */}
            <RegistrationForm
              onOrderCreated={handleOrderCreated}
              onAlreadyConfirmed={handleAlreadyConfirmed}
              whatsappUrl={whatsappUrl}
            />

            {/* 13. FAQ Section */}
            <FAQSection onOpenApply={scrollToApply} />
          </>
        )}

        {/* Payment Verification / Status Screen */}
        {currentView === 'payment_status' && (
          <PaymentStatusView
            orderId={paymentResult.orderId}
            initialStatus={paymentResult.status}
            onGoToDashboard={(sId) => handleOpenStudentPortal(sId)}
            onRetryPayment={() => {
              try {
                window.history.pushState({}, '', '/');
              } catch (e) {}
              setCurrentView('landing');
              setTimeout(scrollToApply, 100);
            }}
            onBackToHome={() => {
              try {
                window.history.pushState({}, '', '/');
              } catch (e) {}
              setCurrentView('landing');
            }}
            whatsappUrl={whatsappUrl}
          />
        )}

        {/* Public Certificate View */}
        {currentView === 'certificate_view' && (
          <CertificateView
            certId={activeCertId}
            onBack={() => {
              try {
                window.history.pushState({}, '', '/');
              } catch (e) {}
              setCurrentView('landing');
            }}
          />
        )}

        {/* Dedicated Standalone Single-Page Student Guide View */}
        {currentView === 'guide_page' && (
          <div className="py-8 bg-slate-50 min-h-screen">
            <StudentGuideView
              onOpenApply={scrollToApply}
              isEmbeddedInDashboard={false}
            />
          </div>
        )}
      </main>

      {/* Cashfree Payment Gateway Checkout Modal */}
      <CashfreeModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderDetails={checkoutOrder}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
        onPaymentPending={handlePaymentPending}
      />

      {/* Mobile Sticky Bar */}
      {currentView === 'landing' && (
        <MobileStickyCTA
          onOpenApply={scrollToApply}
          whatsappUrl={whatsappUrl}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenApply={scrollToApply}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={() => handleOpenStudentPortal()}
        onOpenCertificate={() => handleOpenCertificate('')}
        onOpenAdmin={() => {
          try {
            window.history.pushState({}, '', '/admin/dashboard');
          } catch (e) {}
          setCurrentView('admin_dashboard');
        }}
        whatsappUrl={whatsappUrl}
      />

      {/* User Dashboard & Admin Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(sId) => {
          handleOpenStudentPortal(sId);
        }}
        onAdminLoginSuccess={() => {
          try {
            window.history.pushState({}, '', '/admin/dashboard');
          } catch (e) {}
          setCurrentView('admin_dashboard');
        }}
        onOpenApply={scrollToApply}
      />

    </div>
  );
}
