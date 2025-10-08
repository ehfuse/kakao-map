import { useGlobalFormaState } from "@ehfuse/forma";
import { Map, MapMarker, InfoWindow } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

// 비즈니스 로직 상태만 정의
interface InfoWindowExampleState {
    center: KakaoLatLng;
    level: number;
    selectedMarker: number | null;
}

export function InfoWindowExample() {
    const appState = useGlobalFormaState<InfoWindowExampleState>({
        stateId: "infowindow-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 3,
            selectedMarker: null,
        },
    });

    const center = appState.useValue("center") as KakaoLatLng;
    const level = appState.useValue("level") as number;
    const selectedMarker = appState.useValue("selectedMarker") as number | null;

    const places = [
        { lat: 37.5665, lng: 126.978, name: "서울시청", desc: "서울특별시청" },
        { lat: 37.5794, lng: 126.977, name: "경복궁", desc: "조선시대 법궁" },
        { lat: 37.5512, lng: 126.9882, name: "명동", desc: "쇼핑 & 관광 명소" },
    ];

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    마커를 클릭하면 InfoWindow가 표시됩니다.
                </p>
            </div>

            <Map
                center={center}
                level={level}
                style={{ width: "100%", height: "500px", borderRadius: "8px" }}
            >
                {places.map((place, index) => (
                    <MapMarker
                        key={index}
                        position={place}
                        title={place.name}
                        clickable={true}
                        onClick={() =>
                            appState.setValue("selectedMarker", index)
                        }
                    />
                ))}
                {selectedMarker !== null && (
                    <InfoWindow
                        position={places[selectedMarker]}
                        removable={true}
                        onCloseClick={() =>
                            appState.setValue("selectedMarker", null)
                        }
                        content={
                            <div
                                style={{
                                    padding: "15px",
                                    minWidth: "150px",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 8px 0",
                                        fontSize: "16px",
                                    }}
                                >
                                    {places[selectedMarker].name}
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    {places[selectedMarker].desc}
                                </p>
                            </div>
                        }
                    />
                )}
            </Map>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">선택된 장소:</span>
                    <span className="info-value">
                        {selectedMarker !== null
                            ? places[selectedMarker].name
                            : "없음"}
                    </span>
                </div>
            </div>
        </div>
    );
}
