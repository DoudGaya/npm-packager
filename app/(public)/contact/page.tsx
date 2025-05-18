import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        <p className="text-gray-600 mb-12">
          Have questions? Need help? Feel free to reach out to us using the contact form below.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}