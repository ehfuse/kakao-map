import { useGlobalFormaState } from "@ehfuse/forma";
import { Map, MapMarker, CustomOverlayMap } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

// 비즈니스 로직 상태만 정의
interface CustomOverlayExampleState {
    center: KakaoLatLng;
    level: number;
    showOverlay: boolean;
}

export function CustomOverlayExample() {
    const appState = useGlobalFormaState<CustomOverlayExampleState>({
        stateId: "customoverlay-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 4,
            showOverlay: true,
        },
    });

    const center = appState.useValue("center") as KakaoLatLng;
    const level = appState.useValue("level") as number;
    const showOverlay = appState.useValue("showOverlay") as boolean;

    const places = [
        { lat: 37.5665, lng: 126.978, name: "서울시청", color: "#4285F4" },
        { lat: 37.5794, lng: 126.977, name: "경복궁", color: "#EA4335" },
        { lat: 37.5512, lng: 126.9882, name: "명동", color: "#FBBC04" },
        { lat: 37.5703, lng: 126.9911, name: "북촌한옥마을", color: "#34A853" },
    ];

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    CustomOverlay를 사용하여 지도에 커스텀 HTML 콘텐츠를
                    표시합니다.
                </p>
                <button
                    onClick={() =>
                        appState.setValue("showOverlay", !showOverlay)
                    }
                    style={{
                        padding: "8px 16px",
                        backgroundColor: showOverlay ? "#EA4335" : "#34A853",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {showOverlay ? "오버레이 숨기기" : "오버레이 표시"}
                </button>
            </div>

            <Map center={center} level={level} style={{ borderRadius: "8px" }}>
                {/* 마커 표시 */}
                {places.map((place, index) => (
                    <MapMarker key={index} position={place} />
                ))}

                {/* 커스텀 오버레이 표시 */}
                {showOverlay &&
                    places.map((place, index) => (
                        <CustomOverlayMap key={index} position={place}>
                            <div
                                style={{
                                    backgroundColor: place.color,
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "20px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                }}
                            >
                                {place.name}
                            </div>
                        </CustomOverlayMap>
                    ))}
            </Map>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">표시된 장소:</span>
                    <span className="info-value">{places.length}개</span>
                </div>
                <div className="info-item">
                    <span className="info-label">오버레이 상태:</span>
                    <span className="info-value">
                        {showOverlay ? "표시 중" : "숨김"}
                    </span>
                </div>
            </div>
        </div>
    );
}
