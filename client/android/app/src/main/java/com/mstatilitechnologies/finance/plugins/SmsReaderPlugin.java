package com.mstatilitechnologies.finance.plugins;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.Telephony;
import android.telephony.SmsMessage;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(
    name = "SmsReader",
    permissions = {
        @Permission(
            alias = "sms",
            strings = { 
                Manifest.permission.READ_SMS,
                Manifest.permission.RECEIVE_SMS
            }
        )
    }
)
public class SmsReaderPlugin extends Plugin {
    
    private BroadcastReceiver smsReceiver;
    private Set<String> monitoredSenders = new HashSet<>();
    private boolean isListening = false;
    
    @Override
    public void load() {
        super.load();
    }
    
    /**
     * Check if SMS permissions are granted
     */
    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("sms", getPermissionState("sms").toString());
        call.resolve(result);
    }
    
    /**
     * Request SMS permissions
     */
    @PluginMethod
    public void requestPermissions(PluginCall call) {
        requestPermissionForAlias("sms", call, "permissionCallback");
    }
    
    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        JSObject result = new JSObject();
        result.put("sms", getPermissionState("sms").toString());
        call.resolve(result);
    }
    
    /**
     * Get SMS messages from specific senders
     */
    @PluginMethod
    public void getMessages(PluginCall call) {
        if (getPermissionState("sms") != PermissionState.GRANTED) {
            call.reject("SMS permission not granted");
            return;
        }
        
        JSArray senders = call.getArray("senders");
        int limit = call.getInt("limit", 100);
        long since = call.getLong("since", 0L);
        
        if (senders == null || senders.length() == 0) {
            call.reject("No senders specified");
            return;
        }
        
        try {
            List<String> senderList = new ArrayList<>();
            for (int i = 0; i < senders.length(); i++) {
                senderList.add(senders.getString(i));
            }
            
            JSArray messages = readMessages(senderList, limit, since);
            JSObject result = new JSObject();
            result.put("messages", messages);
            call.resolve(result);
        } catch (JSONException e) {
            call.reject("Error reading messages: " + e.getMessage());
        }
    }
    
    /**
     * Start listening for incoming SMS from specific senders
     */
    @PluginMethod
    public void startListening(PluginCall call) {
        if (getPermissionState("sms") != PermissionState.GRANTED) {
            call.reject("SMS permission not granted");
            return;
        }
        
        JSArray senders = call.getArray("senders");
        if (senders == null || senders.length() == 0) {
            call.reject("No senders specified");
            return;
        }
        
        try {
            monitoredSenders.clear();
            for (int i = 0; i < senders.length(); i++) {
                monitoredSenders.add(senders.getString(i).toUpperCase());
            }
            
            if (!isListening) {
                registerSmsReceiver();
                isListening = true;
            }
            
            JSObject result = new JSObject();
            result.put("listening", true);
            result.put("senders", senders);
            call.resolve(result);
        } catch (JSONException e) {
            call.reject("Error starting listener: " + e.getMessage());
        }
    }
    
    /**
     * Stop listening for incoming SMS
     */
    @PluginMethod
    public void stopListening(PluginCall call) {
        if (isListening && smsReceiver != null) {
            try {
                getContext().unregisterReceiver(smsReceiver);
            } catch (Exception e) {
                // Receiver may not be registered
            }
            isListening = false;
        }
        
        monitoredSenders.clear();
        
        JSObject result = new JSObject();
        result.put("listening", false);
        call.resolve(result);
    }
    
    /**
     * Read SMS messages from the inbox
     */
    private JSArray readMessages(List<String> senders, int limit, long since) {
        JSArray messages = new JSArray();
        
        Uri uri = Uri.parse("content://sms/inbox");
        String[] projection = new String[]{"_id", "address", "body", "date", "read"};
        
        // Build selection for multiple senders
        StringBuilder selection = new StringBuilder();
        List<String> selectionArgs = new ArrayList<>();
        
        if (since > 0) {
            selection.append("date > ? AND (");
            selectionArgs.add(String.valueOf(since));
        } else {
            selection.append("(");
        }
        
        for (int i = 0; i < senders.size(); i++) {
            if (i > 0) {
                selection.append(" OR ");
            }
            selection.append("UPPER(address) LIKE ?");
            selectionArgs.add("%" + senders.get(i).toUpperCase() + "%");
        }
        selection.append(")");
        
        Cursor cursor = getContext().getContentResolver().query(
            uri,
            projection,
            selection.toString(),
            selectionArgs.toArray(new String[0]),
            "date DESC LIMIT " + limit
        );
        
        if (cursor != null) {
            try {
                while (cursor.moveToNext()) {
                    JSObject message = new JSObject();
                    message.put("id", cursor.getString(cursor.getColumnIndexOrThrow("_id")));
                    message.put("address", cursor.getString(cursor.getColumnIndexOrThrow("address")));
                    message.put("body", cursor.getString(cursor.getColumnIndexOrThrow("body")));
                    message.put("date", cursor.getLong(cursor.getColumnIndexOrThrow("date")));
                    message.put("read", cursor.getInt(cursor.getColumnIndexOrThrow("read")) == 1);
                    messages.put(message);
                }
            } finally {
                cursor.close();
            }
        }
        
        return messages;
    }
    
    /**
     * Register the SMS broadcast receiver
     */
    private void registerSmsReceiver() {
        smsReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
                    SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
                    
                    for (SmsMessage sms : messages) {
                        String sender = sms.getDisplayOriginatingAddress();
                        String body = sms.getMessageBody();
                        long timestamp = sms.getTimestampMillis();
                        
                        // Check if sender matches any monitored sender
                        boolean isMonitored = false;
                        for (String monitored : monitoredSenders) {
                            if (sender != null && sender.toUpperCase().contains(monitored)) {
                                isMonitored = true;
                                break;
                            }
                        }
                        
                        if (isMonitored) {
                            JSObject data = new JSObject();
                            data.put("id", String.valueOf(timestamp));
                            data.put("address", sender);
                            data.put("body", body);
                            data.put("date", timestamp);
                            data.put("read", false);
                            
                            notifyListeners("smsReceived", data);
                        }
                    }
                }
            }
        };
        
        IntentFilter filter = new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getContext().registerReceiver(smsReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            getContext().registerReceiver(smsReceiver, filter);
        }
    }
    
    @Override
    protected void handleOnDestroy() {
        if (smsReceiver != null) {
            try {
                getContext().unregisterReceiver(smsReceiver);
            } catch (Exception e) {
                // Ignore
            }
        }
        super.handleOnDestroy();
    }
}
