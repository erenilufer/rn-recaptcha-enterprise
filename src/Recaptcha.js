import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Modal, StyleSheet, ActivityIndicator, View } from "react-native";
import WebView from "react-native-webview";
import getTemplate from "./get-template";

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

const originWhitelist = ["*"];

const Recaptcha = ({
  onVerify,
  onError,
  onClose,
  visible,
  siteKey,
  baseUrl,
  lang,
  style,
  loadingColor = "#ffffff",
  action,
  hasRenderLoading = false,
}) => {
  const $webView = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) {
      setLoading(true);
    }
  }, [visible]);

  const html = useMemo(() => {
    return getTemplate({
      siteKey,
      lang,
      action,
    });
  }, [siteKey, lang, action]);

  const handleMessage = useCallback(
    (content) => {
      try {
        const { status, payload } = JSON.parse(content.nativeEvent.data);
        switch (status) {
          case "loaded":
            setLoading(false);
            break;
          case "verified":
            onVerify && onVerify(payload);
            break;
          case "failed":
            onError && onError(payload);
            break;
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [onVerify, onError]
  );

  const handleNavigationStateChange = useCallback(() => {
    // prevent navigation on Android
    if (!loading) {
      $webView.current.stopLoading();
    }
  }, [loading]);

  const handleShouldStartLoadWithRequest = useCallback(
    (event) => {
      // prevent navigation on iOS
      return event.navigationType === "other";
    },
    [loading]
  );

  const renderLoading = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={loadingColor} />
      </View>
    );
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent>
      {visible && (
        <WebView
          ref={$webView}
          originWhitelist={originWhitelist}
          source={{
            html,
            baseUrl,
          }}
          style={[
            styles.webView,
            hasRenderLoading && { backgroundColor: "rgba(0, 0, 0, 0.2)" },
            style,
          ]}
          onMessage={handleMessage}
          allowsBackForwardNavigationGestures={false}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onNavigationStateChange={handleNavigationStateChange}
          bounces={false}
        />
      )}
      {hasRenderLoading && renderLoading()}
    </Modal>
  );
};

export default Recaptcha;
