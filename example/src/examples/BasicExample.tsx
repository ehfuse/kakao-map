import { useState } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import { Map, MapMarker, CustomInfoWindow } from "../../../src/KakaoMap";
import type { KakaoLatLng, KakaoControlPosition } from "../../../src/types";

// 비즈니스 로직 상태만 정의
interface BasicExampleState {
    center: KakaoLatLng;
    level: number;
    markerPosition: KakaoLatLng;
}

// InfoWindow 컨텐츠 컴포넌트
function InfoWindowContent({
    position,
    onClose,
}: {
    position?: KakaoLatLng;
    onClose?: () => void;
}) {
    const [count, setCount] = useState(0);

    if (!position) return null;

    return (
        <div style={{ minWidth: "200px" }}>
            <h3
                style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                }}
            >
                📍 클릭한 위치
            </h3>
            <p
                style={{
                    margin: "0 0 12px 0",
                    fontSize: "14px",
                    color: "#666",
                }}
            >
                위도: {position.lat.toFixed(4)}
                <br />
                경도: {position.lng.toFixed(4)}
            </p>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "12px",
                }}
            >
                <button
                    onClick={() => setCount(count + 1)}
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                >
                    👆 클릭: {count}
                </button>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 12px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export function BasicExample() {
    // 비즈니스 로직 상태만 forma로 관리
    const appState = useGlobalFormaState<BasicExampleState>({
        stateId: "basic-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 3,
            markerPosition: { lat: 37.5665, lng: 126.978 },
        },
    });

    // 개별 필드 구독
    const center = appState.useValue("center") as KakaoLatLng;
    const level = appState.useValue("level") as number;
    const markerPosition = appState.useValue("markerPosition") as KakaoLatLng;

    // UI 컨트롤 상태는 로컬 상태로 관리
    const [zoomControl, setZoomControl] = useState(true);
    const [zoomControlPosition, setZoomControlPosition] =
        useState<KakaoControlPosition>("RIGHT");
    const [mapTypeControl, setMapTypeControl] = useState(true);
    const [mapTypeControlPosition, setMapTypeControlPosition] =
        useState<KakaoControlPosition>("TOPRIGHT");
    const [draggable, setDraggable] = useState(true);
    const [wheelZoom, setWheelZoom] = useState(true);
    const [traffic, setTraffic] = useState(false);
    const [terrain, setTerrain] = useState(false);

    // 옵션이 변경될 때마다 지도를 새로 생성하기 위한 key
    const mapKey = `${zoomControl}-${zoomControlPosition}-${mapTypeControl}-${mapTypeControlPosition}-${draggable}-${wheelZoom}`;

    return (
        <div className="example-content">
            <div className="control-panel">
                <div className="control-group">
                    <div className="button-group">
                        <button
                            onClick={() =>
                                appState.setValue(
                                    "level",
                                    Math.max(1, level - 1)
                                )
                            }
                        >
                            ➖
                        </button>
                        <span className="level-display">Level {level}</span>
                        <button
                            onClick={() =>
                                appState.setValue(
                                    "level",
                                    Math.min(14, level + 1)
                                )
                            }
                        >
                            ➕
                        </button>
                        <button
                            onClick={() =>
                                appState.setValue("center", {
                                    lat: 37.5665,
                                    lng: 126.978,
                                })
                            }
                        >
                            📍 서울시청
                        </button>
                        <button
                            onClick={() =>
                                appState.setValue("center", {
                                    lat: 37.4979,
                                    lng: 127.0276,
                                })
                            }
                        >
                            📍 강남역
                        </button>
                        <button
                            onClick={() =>
                                appState.setValue("center", {
                                    lat: 37.5172,
                                    lng: 127.0473,
                                })
                            }
                        >
                            📍 잠실
                        </button>
                    </div>
                    <div className="button-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={zoomControl}
                                onChange={(e) =>
                                    setZoomControl(e.target.checked)
                                }
                            />
                            <span>줌 컨트롤</span>
                        </label>
                        <label className="checkbox-label">
                            <span>줌 컨트롤 위치:</span>
                            <select
                                value={zoomControlPosition}
                                onChange={(e) =>
                                    setZoomControlPosition(
                                        e.target.value as KakaoControlPosition
                                    )
                                }
                                style={{
                                    marginLeft: "8px",
                                    padding: "4px 8px",
                                }}
                                disabled={!zoomControl}
                            >
                                <option value="TOPLEFT">좌측 상단</option>
                                <option value="TOP">중앙 상단</option>
                                <option value="TOPRIGHT">우측 상단</option>
                                <option value="LEFT">좌측 중앙</option>
                                <option value="CENTER">중앙</option>
                                <option value="RIGHT">우측 중앙</option>
                                <option value="BOTTOMLEFT">좌측 하단</option>
                                <option value="BOTTOM">중앙 하단</option>
                                <option value="BOTTOMRIGHT">우측 하단</option>
                            </select>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={mapTypeControl}
                                onChange={(e) =>
                                    setMapTypeControl(e.target.checked)
                                }
                            />
                            <span>지도타입 컨트롤</span>
                        </label>
                        <label className="checkbox-label">
                            <span>지도타입 컨트롤 위치:</span>
                            <select
                                value={mapTypeControlPosition}
                                onChange={(e) =>
                                    setMapTypeControlPosition(
                                        e.target.value as KakaoControlPosition
                                    )
                                }
                                style={{
                                    marginLeft: "8px",
                                    padding: "4px 8px",
                                }}
                                disabled={!mapTypeControl}
                            >
                                <option value="TOPLEFT">좌측 상단</option>
                                <option value="TOP">중앙 상단</option>
                                <option value="TOPRIGHT">우측 상단</option>
                                <option value="LEFT">좌측 중앙</option>
                                <option value="CENTER">중앙</option>
                                <option value="RIGHT">우측 중앙</option>
                                <option value="BOTTOMLEFT">좌측 하단</option>
                                <option value="BOTTOM">중앙 하단</option>
                                <option value="BOTTOMRIGHT">우측 하단</option>
                            </select>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={traffic}
                                onChange={(e) => setTraffic(e.target.checked)}
                            />
                            <span>교통정보</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={terrain}
                                onChange={(e) => setTerrain(e.target.checked)}
                            />
                            <span>지형정보</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={draggable}
                                onChange={(e) => setDraggable(e.target.checked)}
                            />
                            <span>드래그</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={wheelZoom}
                                onChange={(e) => setWheelZoom(e.target.checked)}
                            />
                            <span>휠 줌</span>
                        </label>
                    </div>
                </div>
            </div>

            <Map
                key={mapKey}
                center={center}
                level={level}
                style={{ width: "100%", height: "500px", borderRadius: "8px" }}
                zoomControl={zoomControl}
                zoomControlPosition={zoomControlPosition}
                mapTypeControl={mapTypeControl}
                mapTypeControlPosition={mapTypeControlPosition}
                draggable={draggable}
                wheelZoom={wheelZoom}
                traffic={traffic}
                terrain={terrain}
                closeInfoWindowOnClick={true}
                onClick={(mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    appState.setValue("markerPosition", {
                        lat: latlng.getLat(),
                        lng: latlng.getLng(),
                    });
                }}
            >
                <MapMarker position={markerPosition} title="클릭한 위치">
                    <CustomInfoWindow
                        content={
                            <InfoWindowContent position={markerPosition} />
                        }
                    />
                </MapMarker>
            </Map>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">중심:</span>
                    <span className="info-value">
                        {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">마커:</span>
                    <span className="info-value">
                        {markerPosition.lat.toFixed(4)},{" "}
                        {markerPosition.lng.toFixed(4)}
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">레벨:</span>
                    <span className="info-value">{level}</span>
                </div>
            </div>
        </div>
    );
}
