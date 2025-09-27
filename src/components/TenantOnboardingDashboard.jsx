import { useState } from "react";

const sections = [
  { id: "branding", label: "Branding & Design", icon: "🎨" },
  { id: "business", label: "Business Info", icon: "🏢" },
  { id: "content", label: "Website Content", icon: "📝" },
  { id: "services", label: "Services & Pricing", icon: "💼" },
  { id: "businessConfig", label: "Business Config", icon: "⚙️" },
  { id: "technical", label: "Technical & SEO", icon: "🔧" },
  { id: "legal", label: "Legal & Compliance", icon: "⚖️" },
  { id: "marketing", label: "Marketing & Trust", icon: "📈" },
];

export default function TenantOnboardingDashboard() {
  const [activeSection, setActiveSection] = useState("branding");
  const [formData, setFormData] = useState({
    // Tenant basic info
    tenantId: "",
    subdomain: "",
    customDomain: "",
    status: "draft",

    // Branding
    branding: {
      logoUrl: "",
      faviconUrl: "",
      colors: {
        primary: "#3B82F6",
        secondary: "#1E40AF",
        accent: "#06B6D4"
      },
      fontFamily: "Inter, sans-serif",
      heroImage: ""
    },

    // Business Information
    businessInfo: {
      name: "",
      tagline: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      hours: {
        monday: "9:00-17:00",
        tuesday: "9:00-17:00",
        wednesday: "9:00-17:00",
        thursday: "9:00-17:00",
        friday: "9:00-17:00",
        saturday: "closed",
        sunday: "closed"
      }
    },

    // Website Content
    content: {
      hero: {
        headline: "Trusted Notary Services at Your Doorstep",
        subheadline: "Fast, secure, and available when you need us.",
        ctaText: "Book Now"
      },
      about: {
        story: "",
        mission: "",
        values: ["Trust", "Convenience", "Security"]
      },
      testimonials: [
        {
          author: "",
          title: "",
          rating: 5,
          feedback: ""
        }
      ]
    },

    // Services
    services: [
      {
        name: "General Notarization",
        description: "Standard document notarization services",
        price: 25,
        category: "Notary Services"
      }
    ],

    // Business Configuration
    businessConfig: {
      serviceAreas: [""],
      travelFee: 15,
      cancellationPolicy: "24h notice required",
      minNoticeHours: 2,
      paymentMethods: ["card", "paypal"]
    },

    // Technical Configuration
    technicalConfig: {
      seo: {
        metaTitle: "",
        metaDescription: ""
      },
      googleAnalyticsId: "",
      integrations: {
        paymentGateway: "stripe",
        calendar: "google",
        crm: "none"
      }
    },

    // Legal
    legal: {
      termsOfService: "",
      privacyPolicy: "",
      licenses: [""],
      insurance: "Errors & Omissions Insurance"
    },

    // Marketing
    marketing: {
      promotions: [
        {
          title: "",
          discount: ""
        }
      ],
      trustSignals: {
        yearsInBusiness: 1,
        clientsServed: 0,
        awards: [""]
      }
    }
  });

  const handleInput = (section, field, value, index, subfield) => {
    setFormData((prev) => {
      const newData = { ...prev };
      
      // Handle array updates (services, testimonials, promotions, etc.)
      if (typeof index === "number") {
        if (section === "services") {
          newData.services[index][field] = value;
        } else if (section === "content" && field === "testimonials") {
          newData.content.testimonials[index][subfield] = value;
        } else if (section === "marketing" && field === "promotions") {
          newData.marketing.promotions[index][subfield] = value;
        } else if (section === "content" && field === "values") {
          newData.content.about.values[index] = value;
        } else if (field === "serviceAreas") {
          newData.businessConfig.serviceAreas[index] = value;
        } else if (field === "licenses") {
          newData.legal.licenses[index] = value;
        } else if (field === "awards") {
          newData.marketing.trustSignals.awards[index] = value;
        } else if (field === "paymentMethods") {
          const methods = [...newData.businessConfig.paymentMethods];
          if (methods.includes(value)) {
            newData.businessConfig.paymentMethods = methods.filter(m => m !== value);
          } else {
            newData.businessConfig.paymentMethods = [...methods, value];
          }
        }
      }
      // Handle nested object updates
      else if (subfield) {
        if (section === "branding" && field === "colors") {
          newData.branding.colors[subfield] = value;
        } else if (section === "businessInfo" && field === "hours") {
          newData.businessInfo.hours[subfield] = value;
        } else if (section === "content" && field === "hero") {
          newData.content.hero[subfield] = value;
        } else if (section === "content" && field === "about") {
          newData.content.about[subfield] = value;
        } else if (section === "technicalConfig" && field === "seo") {
          newData.technicalConfig.seo[subfield] = value;
        } else if (section === "technicalConfig" && field === "integrations") {
          newData.technicalConfig.integrations[subfield] = value;
        } else if (section === "marketing" && field === "trustSignals") {
          newData.marketing.trustSignals[subfield] = value;
        }
      }
      // Handle direct field updates
      else {
        if (section === "root") {
          newData[field] = value;
        } else {
          newData[section][field] = value;
        }
      }
      
      return newData;
    });
  };

  const addArrayItem = (section, field, defaultItem) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (section === "services") {
        newData.services.push(defaultItem);
      } else if (section === "content" && field === "testimonials") {
        newData.content.testimonials.push(defaultItem);
      } else if (section === "marketing" && field === "promotions") {
        newData.marketing.promotions.push(defaultItem);
      } else if (field === "serviceAreas") {
        newData.businessConfig.serviceAreas.push("");
      } else if (field === "licenses") {
        newData.legal.licenses.push("");
      } else if (field === "awards") {
        newData.marketing.trustSignals.awards.push("");
      } else if (field === "values") {
        newData.content.about.values.push("");
      }
      return newData;
    });
  };

  const removeArrayItem = (section, field, index) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (section === "services") {
        newData.services.splice(index, 1);
      } else if (section === "content" && field === "testimonials") {
        newData.content.testimonials.splice(index, 1);
      } else if (section === "marketing" && field === "promotions") {
        newData.marketing.promotions.splice(index, 1);
      } else if (field === "serviceAreas") {
        newData.businessConfig.serviceAreas.splice(index, 1);
      } else if (field === "licenses") {
        newData.legal.licenses.splice(index, 1);
      } else if (field === "awards") {
        newData.marketing.trustSignals.awards.splice(index, 1);
      } else if (field === "values") {
        newData.content.about.values.splice(index, 1);
      }
      return newData;
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "branding":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                🎨 Branding & Design
              </h2>
              
              {/* Basic Tenant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.subdomain}
                      onChange={(e) => handleInput("root", "subdomain", e.target.value)}
                      placeholder="yourname"
                    />
                    <span className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">
                      .notaryplatform.com
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.customDomain}
                    onChange={(e) => handleInput("root", "customDomain", e.target.value)}
                    placeholder="yourdomain.com"
                  />
                </div>
              </div>

              {/* Brand Assets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.branding.logoUrl}
                    onChange={(e) => handleInput("branding", "logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.branding.faviconUrl}
                    onChange={(e) => handleInput("branding", "faviconUrl", e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <input
                      type="color"
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                      value={formData.branding.colors.primary}
                      onChange={(e) => handleInput("branding", "colors", e.target.value, null, "primary")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <input
                      type="color"
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                      value={formData.branding.colors.secondary}
                      onChange={(e) => handleInput("branding", "colors", e.target.value, null, "secondary")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <input
                      type="color"
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                      value={formData.branding.colors.accent}
                      onChange={(e) => handleInput("branding", "colors", e.target.value, null, "accent")}
                    />
                  </div>
                </div>
              </div>

              {/* Typography & Hero Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.branding.fontFamily}
                    onChange={(e) => handleInput("branding", "fontFamily", e.target.value)}
                  >
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Lato, sans-serif">Lato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.branding.heroImage}
                    onChange={(e) => handleInput("branding", "heroImage", e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "business":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                🏢 Business Information
              </h2>
              
              {/* Basic Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessInfo.name}
                    onChange={(e) => handleInput("businessInfo", "name", e.target.value)}
                    placeholder="Jane's Mobile Notary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessInfo.tagline}
                    onChange={(e) => handleInput("businessInfo", "tagline", e.target.value)}
                    placeholder="Your documents notarized anywhere"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessInfo.phone}
                    onChange={(e) => handleInput("businessInfo", "phone", e.target.value)}
                    placeholder="+1-555-555-5555"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessInfo.email}
                    onChange={(e) => handleInput("businessInfo", "email", e.target.value)}
                    placeholder="info@notarybyjane.com"
                  />
                </div>
              </div>

              {/* Description & Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.businessInfo.description}
                  onChange={(e) => handleInput("businessInfo", "description", e.target.value)}
                  placeholder="We provide fast, secure, and affordable notary services."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.businessInfo.address}
                  onChange={(e) => handleInput("businessInfo", "address", e.target.value)}
                  placeholder="123 Main St, Austin, TX"
                />
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.businessInfo.hours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-3">
                      <div className="w-20 font-medium capitalize">{day}</div>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={hours}
                        onChange={(e) => handleInput("businessInfo", "hours", e.target.value, null, day)}
                        placeholder="9:00-17:00 or closed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                📝 Website Content
              </h2>
              
              {/* Hero Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.content.hero.headline}
                      onChange={(e) => handleInput("content", "hero", e.target.value, null, "headline")}
                      placeholder="Trusted Notary Services at Your Doorstep"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.content.hero.subheadline}
                      onChange={(e) => handleInput("content", "hero", e.target.value, null, "subheadline")}
                      placeholder="Fast, secure, and available when you need us."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.content.hero.ctaText}
                      onChange={(e) => handleInput("content", "hero", e.target.value, null, "ctaText")}
                      placeholder="Book Now"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">About Your Business</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={formData.content.about.story}
                      onChange={(e) => handleInput("content", "about", e.target.value, null, "story")}
                      placeholder="Tell your story... Jane's Notary has been serving Austin since 2015..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.content.about.mission}
                      onChange={(e) => handleInput("content", "about", e.target.value, null, "mission")}
                      placeholder="Making notarization accessible and convenient."
                    />
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Core Values</h3>
                {formData.content.about.values.map((value, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={value}
                      onChange={(e) => handleInput("content", "values", e.target.value, index)}
                      placeholder="Trust, Convenience, Security"
                    />
                    <button
                      onClick={() => removeArrayItem("content", "values", index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("content", "values", "")}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Value
                </button>
              </div>

              {/* Testimonials */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Testimonials</h3>
                {formData.content.testimonials.map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={testimonial.author}
                        onChange={(e) => handleInput("content", "testimonials", e.target.value, index, "author")}
                        placeholder="John Doe"
                      />
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={testimonial.title}
                        onChange={(e) => handleInput("content", "testimonials", e.target.value, index, "title")}
                        placeholder="Client"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={testimonial.rating}
                        onChange={(e) => handleInput("content", "testimonials", parseInt(e.target.value), index, "rating")}
                      />
                    </div>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={testimonial.feedback}
                      onChange={(e) => handleInput("content", "testimonials", e.target.value, index, "feedback")}
                      placeholder="Super easy booking process!"
                    />
                    <button
                      onClick={() => removeArrayItem("content", "testimonials", index)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Testimonial
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("content", "testimonials", { author: "", title: "", rating: 5, feedback: "" })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Add Testimonial
                </button>
              </div>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                💼 Services & Pricing
              </h2>
              
              {formData.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={service.name}
                        onChange={(e) => handleInput("services", "name", e.target.value, index)}
                        placeholder="General Notarization"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={service.category}
                        onChange={(e) => handleInput("services", "category", e.target.value, index)}
                        placeholder="Notary Services"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleInput("services", "description", e.target.value, index)}
                      placeholder="Standard document notarization services"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={service.price}
                      onChange={(e) => handleInput("services", "price", parseFloat(e.target.value), index)}
                      placeholder="25"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem("services", null, index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Service
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("services", null, { name: "", description: "", price: 0, category: "" })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Add Service
              </button>
            </div>
          </div>
        );

      case "businessConfig":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                ⚙️ Business Configuration
              </h2>
              
              {/* Service Areas */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
                {formData.businessConfig.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={area}
                      onChange={(e) => handleInput("businessConfig", "serviceAreas", e.target.value, index)}
                      placeholder="Austin, TX"
                    />
                    <button
                      onClick={() => removeArrayItem("businessConfig", "serviceAreas", index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("businessConfig", "serviceAreas", "")}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Service Area
                </button>
              </div>

              {/* Pricing & Policies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Fee ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessConfig.travelFee}
                    onChange={(e) => handleInput("businessConfig", "travelFee", parseFloat(e.target.value))}
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Notice (hours)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessConfig.minNoticeHours}
                    onChange={(e) => handleInput("businessConfig", "minNoticeHours", parseInt(e.target.value))}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.businessConfig.cancellationPolicy}
                  onChange={(e) => handleInput("businessConfig", "cancellationPolicy", e.target.value)}
                  placeholder="24h notice required for cancellations"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["card", "paypal", "venmo", "cash", "check", "zelle"].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.businessConfig.paymentMethods.includes(method)}
                        onChange={(e) => handleInput("businessConfig", "paymentMethods", method, null)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "technical":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                🔧 Technical & SEO
              </h2>
              
              {/* SEO Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.technicalConfig.seo.metaTitle}
                      onChange={(e) => handleInput("technicalConfig", "seo", e.target.value, null, "metaTitle")}
                      placeholder="Jane's Mobile Notary - Professional Notary Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.technicalConfig.seo.metaDescription}
                      onChange={(e) => handleInput("technicalConfig", "seo", e.target.value, null, "metaDescription")}
                      placeholder="Affordable mobile notary in Austin. Fast, secure, and available when you need us."
                    />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.technicalConfig.googleAnalyticsId}
                    onChange={(e) => handleInput("technicalConfig", "googleAnalyticsId", e.target.value)}
                    placeholder="UA-12345678-1 or G-XXXXXXXXXX"
                  />
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.technicalConfig.integrations.paymentGateway}
                      onChange={(e) => handleInput("technicalConfig", "integrations", e.target.value, null, "paymentGateway")}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Integration</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.technicalConfig.integrations.calendar}
                      onChange={(e) => handleInput("technicalConfig", "integrations", e.target.value, null, "calendar")}
                    >
                      <option value="google">Google Calendar</option>
                      <option value="outlook">Outlook</option>
                      <option value="ical">iCal</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CRM Integration</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.technicalConfig.integrations.crm}
                      onChange={(e) => handleInput("technicalConfig", "integrations", e.target.value, null, "crm")}
                    >
                      <option value="hubspot">HubSpot</option>
                      <option value="salesforce">Salesforce</option>
                      <option value="pipedrive">Pipedrive</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                ⚖️ Legal & Compliance
              </h2>
              
              {/* Legal Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms of Service URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.legal.termsOfService}
                    onChange={(e) => handleInput("legal", "termsOfService", e.target.value)}
                    placeholder="https://yourdomain.com/terms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.legal.privacyPolicy}
                    onChange={(e) => handleInput("legal", "privacyPolicy", e.target.value)}
                    placeholder="https://yourdomain.com/privacy"
                  />
                </div>
              </div>

              {/* Licenses */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Professional Licenses</h3>
                {formData.legal.licenses.map((license, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={license}
                      onChange={(e) => handleInput("legal", "licenses", e.target.value, index)}
                      placeholder="TX-12345"
                    />
                    <button
                      onClick={() => removeArrayItem("legal", "licenses", index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("legal", "licenses", "")}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add License
                </button>
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Information</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.legal.insurance}
                  onChange={(e) => handleInput("legal", "insurance", e.target.value)}
                  placeholder="Errors & Omissions Insurance - $1M coverage"
                />
              </div>
            </div>
          </div>
        );

      case "marketing":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                📈 Marketing & Trust Signals
              </h2>
              
              {/* Trust Signals */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Trust Signals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.marketing.trustSignals.yearsInBusiness}
                      onChange={(e) => handleInput("marketing", "trustSignals", parseInt(e.target.value), null, "yearsInBusiness")}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clients Served</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.marketing.trustSignals.clientsServed}
                      onChange={(e) => handleInput("marketing", "trustSignals", parseInt(e.target.value), null, "clientsServed")}
                      placeholder="1200"
                    />
                  </div>
                </div>

                {/* Awards */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Awards & Recognition</h4>
                  {formData.marketing.trustSignals.awards.map((award, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-3">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={award}
                        onChange={(e) => handleInput("marketing", "awards", e.target.value, index)}
                        placeholder="Best of Austin 2023"
                      />
                      <button
                        onClick={() => removeArrayItem("marketing", "awards", index)}
                        className="text-red-500 hover:text-red-700 px-2 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem("marketing", "awards", "")}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Award
                  </button>
                </div>
              </div>

              {/* Promotions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Promotions</h3>
                {formData.marketing.promotions.map((promotion, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={promotion.title}
                          onChange={(e) => handleInput("marketing", "promotions", e.target.value, index, "title")}
                          placeholder="Back to School Special"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={promotion.discount}
                          onChange={(e) => handleInput("marketing", "promotions", e.target.value, index, "discount")}
                          placeholder="10% off"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeArrayItem("marketing", "promotions", index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Promotion
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("marketing", "promotions", { title: "", discount: "" })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Add Promotion
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600">Select a section to configure</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold mb-6">Tenant Onboarding</h1>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {renderSection()}
          
          {/* Save Actions */}
          <div className="mt-8 flex justify-between items-center bg-white rounded-lg border p-6">
            <div className="text-sm text-gray-600">
              <p>Status: <span className="font-medium capitalize">{formData.status}</span></p>
              <p className="text-xs mt-1">Changes are automatically saved as drafts</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  console.log("Saving as draft...", formData);
                  // TODO: Implement save as draft API call
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Draft
              </button>
              <button 
                onClick={() => {
                  console.log("Publishing tenant config...", formData);
                  // TODO: Implement publish API call
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Publish Live
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
