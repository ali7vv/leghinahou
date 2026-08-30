import { getToken, onMessage } from "firebase/messaging";
import { auth } from "./firebase"; // استيراد الـ auth العندنا

// ملاحظة: بما أن الـ messaging بيشتغل في المتصفح فقط، بنتحقق منه
export const requestNotificationPermission = async (messagingInstance: any) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // هنا بنستخدم المفتاح الجبته من فايربيس (VAPID Key)
      const currentToken = await getToken(messagingInstance, {
        vapidKey: "BPVcFUStDi-LlpHf99XwTp-1C4z9Ok1b4O-ZoWs2IuEfqTsekmT8iqWne7lOfWtxgJxY_-pYHvDl80eRVFl3YnY",
      });
      
      if (currentToken) {
        console.log("رمز إشعارات المستخدم (Token):", currentToken);
        // هنا ممكن تحفظ الـ Token ده في قاعدة البيانات مع بيانات المستخدم لو حابب ترسله إشعارات لاحقاً
        return currentToken;
      } else {
        console.log("لم يتم العثور على رمز الإشعارات.");
      }
    } else {
      console.log("تم رفض إذن الإشعارات من المستخدم.");
    }
  } catch (error) {
    console.error("حدث خطأ أثناء طلب إذن الإشعارات:", error);
  }
};