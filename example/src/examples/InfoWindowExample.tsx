import { useGlobalFormaState } from "@ehfuse/forma";
import { Map, MapMarker, CustomInfoWindow } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

// 비즈니스 로직 상태만 정의
interface InfoWindowExampleState {
    center: KakaoLatLng;
    level: number;
}

export function InfoWindowExample() {
    const appState = useGlobalFormaState<InfoWindowExampleState>({
        stateId: "infowindow-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 3,
        },
    });

    const center = appState.useValue("center") as KakaoLatLng;
    const level = appState.useValue("level") as number;

    const places = [
        { lat: 37.5665, lng: 126.978, name: "서울시청", desc: "서울특별시청" },
        { lat: 37.5794, lng: 126.977, name: "경복궁", desc: "조선시대 법궁" },
        { lat: 37.5512, lng: 126.9882, name: "명동", desc: "쇼핑 & 관광 명소" },
    ];

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    마커를 클릭하면 CustomInfoWindow가 표시됩니다.
                    <br />
                    지도를 클릭하면 InfoWindow가 닫힙니다.
                </p>
            </div>

            <Map
                center={center}
                level={level}
                style={{ width: "100%", height: "500px", borderRadius: "8px" }}
                closeInfoWindowOnClick={true}
            >
                {places.map((place, index) => (
                    <MapMarker key={index} position={place} title={place.name}>
                        <CustomInfoWindow
                            content={
                                <div>
                                    <h3
                                        style={{
                                            margin: "0 0 8px 0",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {place.name}
                                    </h3>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "14px",
                                            color: "#666",
                                        }}
                                    >
                                        {place.desc}
                                    </p>
                                </div>
                            }
                        />
                    </MapMarker>
                ))}
            </Map>
        </div>
    );
}
