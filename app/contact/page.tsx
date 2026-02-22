import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | Oushi Library",
    description: "Get in touch with the Oushi Library team",
};

export default function ContactPage() {
    return (
        <main className="container container--lg mx-auto px-4 py-12 md:py-20 min-h-screen">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
                    Contact Us
                </h1>
                <p className="text-[var(--color-text-secondary)] text-lg">
                    Have a question or feedback? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form Placeholder */}
                <div className="card p-6 md:p-8">
                    <h2 className="font-display text-2xl font-semibold mb-6">Send us a message</h2>
                    <form className="space-y-4">
                        {/* TODO: Wire up actual form submission logic */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label form-label--required">First Name</label>
                                <input type="text" className="input" placeholder="John" />
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label--required">Last Name</label>
                                <input type="text" className="input" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label form-label--required">Email Address</label>
                            <input type="email" className="input" placeholder="john@example.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label form-label--required">Message</label>
                            <textarea className="textarea" rows={5} placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="button" className="btn btn--primary w-full md:w-auto px-8">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info Placeholder */}
                <div className="flex flex-col gap-6">
                    <div className="card p-6 md:p-8 flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-dusty-100)] rounded-lg text-[var(--color-dusty-600)]">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                            <p className="text-[var(--color-text-secondary)] mb-2">Our friendly team is here to help.</p>
                            {/* TODO: Add real email */}
                            <a href="mailto:info@oushilibrary.com" className="text-[var(--color-dusty-600)] font-medium">info@oushilibrary.com</a>
                        </div>
                    </div>

                    <div className="card p-6 md:p-8 flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-sage-100)] rounded-lg text-[var(--color-sage-600)]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Office</h3>
                            <p className="text-[var(--color-text-secondary)] mb-2">Come say hello at our office HQ.</p>
                            {/* TODO: Add real address */}
                            <p className="text-[var(--color-text-primary)] font-medium">123 Learning Street, Knowledge City</p>
                        </div>
                    </div>

                    <div className="card p-6 md:p-8 flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-terracotta-100)] rounded-lg text-[var(--color-terracotta-600)]">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Phone</h3>
                            <p className="text-[var(--color-text-secondary)] mb-2">Mon-Fri from 8am to 5pm.</p>
                            {/* TODO: Add real phone number */}
                            <a href="tel:+1234567890" className="text-[var(--color-terracotta-500)] font-medium">+1 (555) 000-0000</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
