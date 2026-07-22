const nodemailer = require("nodemailer");
const ApiError = require("../errors/apiError.utils");

/**
 * Email Service Utility
 * Handles all email sending functionality
 */

// Email templates
const emailTemplates = {
  "appointment-confirmation": {
    subject: "Appointment Confirmation - {{appointmentType}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5282;">Appointment Confirmation</h2>
        <p>Dear {{patientName}},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> {{doctorName}}</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
          <p><strong>Address:</strong> {{clinicAddress}}</p>
        </div>
        <p>{{instructions}}</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "appointment-reminder": {
    subject: "Appointment Reminder - Tomorrow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5282;">Appointment Reminder</h2>
        <p>Dear {{patientName}},</p>
        <p>This is a friendly reminder about your upcoming appointment:</p>
        <div style="background-color: #fef5e7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f6ad55;">
          <p><strong>Doctor:</strong> Dr. {{doctorName}} ({{specialization}})</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
        </div>
        <p>{{reminderMessage}}</p>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "appointment-cancellation": {
    subject: "Appointment Cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Appointment Cancelled</h2>
        <p>Dear {{patientName}},</p>
        <p>We regret to inform you that your appointment has been cancelled:</p>
        <div style="background-color: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e53e3e;">
          <p><strong>Doctor:</strong> {{doctorName}}</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
          <p><strong>Reason:</strong> {{reason}}</p>
        </div>
        <p>{{contactInfo}}</p>
        <p>We apologize for any inconvenience caused.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "registration-approved": {
    subject: "Registration Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #38a169;">Registration Approved</h2>
        <p>Dear {{patientName}},</p>
        <p>Great news! Your registration has been approved for:</p>
        <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38a169;">
          <p><strong>Doctor:</strong> {{doctorName}}</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
        </div>
        <p>{{message}}</p>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "registration-rejected": {
    subject: "Registration Status Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Registration Status Update</h2>
        <p>Dear {{patientName}},</p>
        <p>{{message}}</p>
        <div style="background-color: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Appointment:</strong> {{appointmentType}}</p>
          <p><strong>Doctor:</strong> {{doctorName}}</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
        </div>
        <p>Please contact us if you have any questions or would like to register for alternative appointments.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "registration-waitlist": {
    subject: "Added to Waitlist",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d69e2e;">Added to Waitlist</h2>
        <p>Dear {{patientName}},</p>
        <p>{{message}}</p>
        <div style="background-color: #fef5e7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d69e2e;">
          <p><strong>Appointment:</strong> {{appointmentType}}</p>
          <p><strong>Doctor:</strong> {{doctorName}}</p>
          <p><strong>Date:</strong> {{appointmentDate}}</p>
          <p><strong>Time:</strong> {{appointmentTime}}</p>
        </div>
        <p>We will notify you immediately if a spot becomes available.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  welcome: {
    subject: "Welcome to Hospital Management System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5282;">Welcome to Our Hospital</h2>
        <p>Dear {{userName}},</p>
        <p>Welcome to our Hospital Management System! Your {{userType}} account has been successfully created.</p>
        <div style="background-color: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>You can now:</p>
          <ul>
            <li>Schedule appointments</li>
            <li>View your medical history</li>
            <li>Receive appointment reminders</li>
            <li>Access your profile information</li>
          </ul>
        </div>
        <p>To get started, please log in to your account:</p>
        <a href="{{loginUrl}}" style="display: inline-block; background-color: #2c5282; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Login to Your Account</a>
        <p>If you have any questions, please don't hesitate to contact our support team at {{supportEmail}}.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "password-reset": {
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Password Reset Request</h2>
        <p>Dear {{userName}},</p>
        <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <div style="background-color: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>To reset your password, click the button below:</p>
          <a href="{{resetUrl}}" style="display: inline-block; background-color: #e53e3e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Reset Password</a>
          <p><strong>This link will expire in {{expirationTime}}.</strong></p>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4a5568;">{{resetUrl}}</p>
        <p>If you need help, contact our support team at {{supportEmail}}.</p>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
  "general-notification": {
    subject: "{{subject}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5282;">{{title}}</h2>
        <p>Dear {{patientName}},</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          {{content}}
        </div>
        <p>Best regards,<br>Hospital Management Team</p>
      </div>
    `,
  },
};

/**
 * Create email transporter based on environment configuration
 */
const createTransporter = () => {
  const emailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // For development, use Ethereal Email (fake SMTP service)
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_USER) {
    // Will trigger development mode email logging
    return null;
  }

  try {
    return nodemailer.createTransporter(emailConfig);
  } catch (error) {
    // Return null to fallback to development mode
    return null;
  }
};

/**
 * Process email template with data
 * @param {string} templateName - Template name
 * @param {Object} data - Template data
 * @returns {Object} Processed template
 */
const processTemplate = (templateName, data) => {
  const template = emailTemplates[templateName];

  if (!template) {
    throw new ApiError(`Email template '${templateName}' not found`, 400);
  }

  // Replace template variables with actual data
  let processedSubject = template.subject;
  let processedHtml = template.html;

  // Replace all {{variable}} placeholders with actual values
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    processedSubject = processedSubject.replace(regex, data[key] || "");
    processedHtml = processedHtml.replace(regex, data[key] || "");
  });

  return {
    subject: processedSubject,
    html: processedHtml,
  };
};

/**
 * Send email using configured transporter
 * @param {Object} emailOptions - Email options
 * @returns {Promise<Object>} Email send result
 */
const sendEmail = async (emailOptions) => {
  try {
    const {
      to,
      subject,
      template,
      data = {},
      cc = null,
      bcc = null,
      attachments = [],
    } = emailOptions;

    // Validate required fields
    if (!to) {
      throw new ApiError("Recipient email is required", 400);
    }

    // Get email content
    let emailSubject;
    let emailHtml;

    if (template) {
      // Use template
      const processedTemplate = processTemplate(template, data);
      emailSubject = processedTemplate.subject;
      emailHtml = processedTemplate.html;
    } else if (subject) {
      // Use provided subject and content
      emailSubject = subject;
      emailHtml = data.html || data.content || "<p>No content provided</p>";
    } else {
      throw new ApiError("Either template or subject must be provided", 400);
    }

    const transporter = createTransporter();

    // If no transporter (development mode), simulate email sending
    if (!transporter) {
      // In development mode, we simulate email sending
      return {
        success: true,
        messageId: `dev-mode-${Date.now()}`,
        mode: "development",
        info: {
          to,
          subject: emailSubject,
          template: template || "Custom",
        },
      };
    }

    // Prepare mail options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || "Hospital Management System",
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
      to: to,
      subject: emailSubject,
      html: emailHtml,
      ...(cc && { cc }),
      ...(bcc && { bcc }),
      ...(attachments.length > 0 && { attachments }),
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      mode: "production",
      accepted: result.accepted,
      rejected: result.rejected,
    };
  } catch (error) {
    // Don't throw error in production to prevent breaking the main flow
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: error.message,
        mode: "production-failed",
      };
    }
    throw new ApiError(`Failed to send email: ${error.message}`, 500);
  }
};

/**
 * Verify email configuration
 * @returns {Promise<boolean>} Verification result
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        "📧 Email service running in development mode (console logging)"
      );
      return true;
    }

    await transporter.verify();
    console.log("✅ Email service configuration verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error.message);
    return false;
  }
};

/**
 * Send test email (for configuration testing)
 * @param {string} testEmail - Email address to send test to
 * @returns {Promise<Object>} Test result
 */
const sendTestEmail = async (testEmail) => {
  try {
    const result = await sendEmail({
      to: testEmail,
      template: "general-notification",
      data: {
        patientName: "Test User",
        title: "Email Configuration Test",
        subject: "Test Email from Hospital System",
        content:
          "<p>This is a test email to verify your email configuration is working correctly.</p><p>If you received this email, your email service is properly configured!</p>",
      },
    });

    return result;
  } catch (error) {
    throw new ApiError(`Test email failed: ${error.message}`, 500);
  }
};

/**
 * Extract template variables from template content
 * @param {Object} template - Template object
 * @returns {Array} Array of variables used in template
 * @private
 */
const extractTemplateVariables = (template) => {
  const content = `${template.subject} ${template.html}`;
  const matches = content.match(/\{\{(\w+)\}\}/g);

  if (!matches) return [];

  return [...new Set(matches.map((match) => match.replace(/\{\{|\}\}/g, "")))];
};

/**
 * Get available email templates
 * @returns {Array} List of available templates
 */
const getAvailableTemplates = () =>
  Object.keys(emailTemplates).map((templateName) => ({
    name: templateName,
    subject: emailTemplates[templateName].subject,
    variables: extractTemplateVariables(emailTemplates[templateName]),
  }));

module.exports = {
  sendEmail,
  verifyEmailConfig,
  sendTestEmail,
  getAvailableTemplates,
  emailTemplates,
};
