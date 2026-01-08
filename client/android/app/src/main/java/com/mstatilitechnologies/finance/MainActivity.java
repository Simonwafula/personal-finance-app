package com.mstatilitechnologies.finance;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.mstatilitechnologies.finance.plugins.SmsReaderPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register custom plugins
        registerPlugin(SmsReaderPlugin.class);
        
        super.onCreate(savedInstanceState);
    }
}
