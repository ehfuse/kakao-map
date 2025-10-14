import { useMemo } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import {
    Map,
    MapMarker,
    CustomInfoWindow,
    useMapContext,
} from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

// 마커 데이터 타입
interface MarkerData {
    lat: number;
    lng: number;
    title: string;
}

// 비즈니스 로직 상태 정의
interface ClusterExampleState {
    center: KakaoLatLng;
    level: number;
}

/**
 * 간단한 클러스터 예제
 * - Map에 clusterer={true} 설정
 * - MapMarker는 자동으로 클러스터에 포함됨 (clustered prop 생략 가능)
 * - 1개의 공용 CustomInfoWindow로 선택된 마커 정보 표시 (성능 최적화)
 * - MapContext의 selectedMarker 활용
 */

// 마커 정보를 저장하는 WeakMap (마커 인스턴스 -> 마커 데이터)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markerDataMap = new WeakMap<any, MarkerData>();

function ClusterContent() {
    const { selectedMarker } = useMapContext();
    const markerData = selectedMarker
        ? markerDataMap.get(selectedMarker)
        : null;

    if (!selectedMarker || !markerData) return null;

    return (
        <CustomInfoWindow
            marker={selectedMarker}
            content={
                <div
                    style={{
                        padding: "10px",
                        minWidth: "150px",
                    }}
                >
                    <h4
                        style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    >
                        {markerData.title}
                    </h4>
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#666",
                        }}
                    >
                        <div>위도: {markerData.lat.toFixed(4)}</div>
                        <div>경도: {markerData.lng.toFixed(4)}</div>
                    </div>
                </div>
            }
        />
    );
}

export function ClusterExample() {
    const appState = useGlobalFormaState<ClusterExampleState>({
        stateId: "cluster-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 7,
        },
    });

    const center = appState.useValue("center") as KakaoLatLng;
    const level = appState.useValue("level") as number;

    // 서울 주요 지역에 랜덤하게 1000개의 마커 생성
    const markers = useMemo(() => {
        const locations = [
            { name: "강남", lat: 37.4979, lng: 127.0276 },
            { name: "잠실", lat: 37.5133, lng: 127.1028 },
            { name: "홍대", lat: 37.5563, lng: 126.9236 },
            { name: "신촌", lat: 37.5594, lng: 126.9426 },
            { name: "이태원", lat: 37.5346, lng: 126.9946 },
            { name: "명동", lat: 37.5636, lng: 126.9826 },
            { name: "서울역", lat: 37.5547, lng: 126.9707 },
            { name: "시청", lat: 37.5665, lng: 126.978 },
            { name: "종로", lat: 37.5703, lng: 126.9826 },
            { name: "동대문", lat: 37.5707, lng: 127.0099 },
            { name: "여의도", lat: 37.5219, lng: 126.9245 },
            { name: "건대", lat: 37.5403, lng: 127.0695 },
            { name: "성수", lat: 37.5448, lng: 127.0557 },
            { name: "압구정", lat: 37.5272, lng: 127.0286 },
            { name: "청담", lat: 37.5196, lng: 127.0479 },
        ];

        const result: Array<{ lat: number; lng: number; title: string }> = [];
        // 1000개의 마커 생성
        for (let i = 0; i < 1000; i++) {
            const location = locations[i % locations.length];
            result.push({
                lat: location.lat + (Math.random() - 0.5) * 0.05,
                lng: location.lng + (Math.random() - 0.5) * 0.05,
                title: `${location.name} #${i + 1}`,
            });
        }
        return result;
    }, []);

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    🎯 {markers.length}개의 마커가 클러스터링되어 표시됩니다. 줌
                    인/아웃하면 마커들이 그룹화되는 것을 확인할 수 있습니다.
                    <br />
                    💡 1개의 공용 CustomInfoWindow로 성능 최적화 (마커 클릭 시
                    표시)
                </p>
                <div className="control-group">
                    <label>줌 레벨</label>
                    <div className="button-group">
                        <button
                            onClick={() =>
                                appState.setValue(
                                    "level",
                                    Math.max(1, level - 1)
                                )
                            }
                        >
                            <span>➖</span>
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
                    </div>
                    <div className="button-group">
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
                    </div>
                </div>
            </div>

            <Map
                center={center}
                level={level}
                style={{ borderRadius: "8px" }}
                height={800}
                clusterer={true}
                closeInfoWindowOnClick={true} // 지도를 클릭하면 InfoWindow 닫기
            >
                {markers.map((marker, index) => (
                    <MapMarker
                        key={index}
                        position={marker}
                        title={marker.title}
                        centerOnClick={true}
                        zoomOnClick={3}
                        onClick={(markerInstance) => {
                            // 마커 인스턴스와 데이터를 매핑
                            markerDataMap.set(markerInstance, marker);
                        }}
                    />
                ))}

                {/* 선택된 마커가 있을 때만 1개의 CustomInfoWindow 표시 */}
                <ClusterContent />
            </Map>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">전체 마커 개수:</span>
                    <span className="info-value">{markers.length}개</span>
                </div>
                <div className="info-item">
                    <span className="info-label">클러스터링:</span>
                    <span className="info-value" style={{ color: "#28a745" }}>
                        ✓ 활성화
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">InfoWindow 타입:</span>
                    <span className="info-value" style={{ color: "#0d6efd" }}>
                        CustomInfoWindow
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">현재 줌 레벨:</span>
                    <span className="info-value">{level}</span>
                </div>
            </div>
        </div>
    );
}
