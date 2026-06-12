package com.transpower.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    /*
    static {
        System.loadLibrary("native-lib");
    }
    */

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    // Native methods (Temporarily disabled)
    /*
    public native String getSecurityToken();
    public native boolean isDeviceSecure();
    */
}
