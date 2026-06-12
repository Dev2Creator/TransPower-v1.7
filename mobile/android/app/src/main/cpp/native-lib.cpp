#include <jni.h>
#include <string>

extern "C" JNIEXPORT jstring JNICALL
Java_com_transpower_app_MainActivity_getSecurityToken(
        JNIEnv* env,
        jobject /* this */) {
    // This token can be used to verify the app's integrity or unlock hidden features
    std::string security_token = "TP-V6-SECURE-ALPHA-99";
    return env->NewStringUTF(security_token.c_str());
}

extern "C" JNIEXPORT jboolean JNICALL
Java_com_transpower_app_MainActivity_isDeviceSecure(
        JNIEnv* env,
        jobject /* this */) {
    // Simple native check - could be expanded for root detection etc.
    return JNI_TRUE;
}
