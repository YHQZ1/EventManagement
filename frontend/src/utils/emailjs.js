import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("8tVsf67mT4zGV8s_L"); // Get this from EmailJS dashboard

export const sendEventNotification = async (templateParams) => {
  try {
    const response = await emailjs.send(
      'service_avuwvtg',     // EmailJS Service ID
      'template_ysc9juq',    // EmailJS Template ID for event notifications
      templateParams
    );
    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
};

export const sendBroadcastEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(
      'service_avuwvtg',     // EmailJS Service ID  
      'template_br0g3tx', // EmailJS Template ID for broadcasts
      templateParams
    );
    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
};