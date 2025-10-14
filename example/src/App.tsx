import { useState } from "react";
import "./App.css";
import {
    BasicExample,
    ClusterExample,
    InfoWindowExample,
    CustomOverlayExample,
    CustomMarkerExample,
    AddressSearchExample,
} from "./examples";

type TabType =
    | "basic"
    | "cluster"
    | "infowindow"
    | "customoverlay"
    | "custommarker"
    | "address";

function App() {
    const [activeTab, setActiveTab] = useState<TabType>("basic");

    const tabs = [
        { id: "basic" as TabType, label: "기본 예제", icon: "🗺️" },
        { id: "cluster" as TabType, label: "클러스터", icon: "📍" },
        { id: "infowindow" as TabType, label: "InfoWindow", icon: "💬" },
        { id: "customoverlay" as TabType, label: "CustomOverlay", icon: "✨" },
        { id: "custommarker" as TabType, label: "커스텀 마커", icon: "🖼️" },
        { id: "address" as TabType, label: "주소 검색", icon: "🔍" },
    ];

    return (
        <div className="app">
            <header className="app-header">
                <h1>Kakao Map React Components</h1>
                <p className="subtitle">@ehfuse/kakao-map 예제</p>
            </header>

            <nav className="tab-nav">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${
                            activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>

            <main className="main-content">
                {activeTab === "basic" && <BasicExample />}
                {activeTab === "cluster" && <ClusterExample />}
                {activeTab === "infowindow" && <InfoWindowExample />}
                {activeTab === "customoverlay" && <CustomOverlayExample />}
                {activeTab === "custommarker" && <CustomMarkerExample />}
                {activeTab === "address" && <AddressSearchExample />}
            </main>

            <footer className="app-footer">
                <p>Made with ❤️ by KIM YOUNG JIN</p>
            </footer>
        </div>
    );
}

export default App;
