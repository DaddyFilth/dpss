import Link from 'next/link';
import { MessageCircle, Send, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">AI Dropship</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered dropshipping with personalized recommendations and secure payments.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="text-muted-foreground hover:text-primary">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/admin/settings" className="text-muted-foreground hover:text-primary">Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Dropship. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Chat">
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Share">
              <Send className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
