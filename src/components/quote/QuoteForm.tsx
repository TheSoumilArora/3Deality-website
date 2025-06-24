import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Send } from 'lucide-react';
import { useEmailService } from '@/hooks/useEmailService';

export default function QuoteForm() {
  const { sendContactForm, isLoading } = useEmailService();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    material: '',
    quantity: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contactMessage = `
Project Type: ${formData.projectType}
Material Preference: ${formData.material}
Quantity: ${formData.quantity}
Phone: ${formData.phone}

Message: ${formData.message}
    `;

    const success = await sendContactForm({
      name: formData.name,
      email: formData.email,
      message: contactMessage,
      subject: `Quote Request - ${formData.projectType}`
    });

    if (success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        material: '',
        quantity: '',
        message: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Request a Quote</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you with a detailed quote within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Type *
                    </label>
                    <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e-commerce">E-commerce Product</SelectItem>
                        <SelectItem value="prototype">Rapid Prototyping</SelectItem>
                        <SelectItem value="custom">Custom Order</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Material Preference
                    </label>
                    <Select value={formData.material} onValueChange={(value) => handleInputChange('material', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pla">PLA</SelectItem>
                        <SelectItem value="abs">ABS</SelectItem>
                        <SelectItem value="petg">PETG</SelectItem>
                        <SelectItem value="tpu">TPU (Flexible)</SelectItem>
                        <SelectItem value="carbon-fiber">Carbon Fiber</SelectItem>
                        <SelectItem value="nylon">Nylon</SelectItem>
                        <SelectItem value="unsure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <Input
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="How many pieces do you need?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Description *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please describe your project, requirements, timeline, and any special considerations..."
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white py-6"
                >
                  {isLoading ? (
                    'Sending Request...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Quote Request
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> For faster responses and file sharing, you can also contact us directly on WhatsApp using the button above.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}