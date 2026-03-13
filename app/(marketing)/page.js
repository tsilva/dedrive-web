import Header from '@/components/Header';
import AccountScreen from '@/components/screens/AccountScreen';
import Footer from '@/components/Footer';

export default function MarketingPage() {
  return (
    <div className="app">
      <Header screen="account" user={null} />
      <div className="main">
        <AccountScreen signInHref="/app?start=signin" user={null} />
      </div>
      <Footer />
    </div>
  );
}
