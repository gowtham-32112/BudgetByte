import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User } from 'lucide-react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleMailTo = (e) => {
        e.preventDefault();
        
        // This is the 100% free method using the user's native email client
        const email = 'support@budgetbyte.com';
        const subject = encodeURIComponent(`${formData.subject} - from ${formData.name}`);
        const body = encodeURIComponent(formData.message);
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Get in Touch
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Have a question, feedback, or need support? We're here to help you master your student finances.
                    </p>
                </div>

                <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-2xl -z-10" />
                    
                    <form onSubmit={handleMailTo} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                                    <User size={16} className="text-indigo-400" /> Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="Alex Doe"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                                    <Mail size={16} className="text-indigo-400" /> Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="How can we help?"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                                <MessageSquare size={16} className="text-indigo-400" /> Message
                            </label>
                            <textarea
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                                placeholder="Write your message here..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
