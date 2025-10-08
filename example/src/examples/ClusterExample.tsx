import { useMemo } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import { Map, MapMarker } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

// 비즈니스 로직 상태 정의
interface ClusterExampleState {
    center: KakaoLatLng;
    level: number;
}

/**
 * 간단한 클러스터 예제
 * - Map에 clusterer={true} 설정
 * - MapMarker는 자동으로 클러스터에 포함됨 (clustered prop 생략 가능)
 * - onCreate, onTilesLoaded, useEffect 등 복잡한 설정 불필요
 */
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

    // 서울 주요 지역에 랜덤하게 많은 마커 생성
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
        // 각 위치 주변에 여러 마커 생성
        locations.forEach((location) => {
            // 각 위치마다 5-10개의 마커 생성
            const count = Math.floor(Math.random() * 6) + 5;
            for (let i = 0; i < count; i++) {
                result.push({
                    lat: location.lat + (Math.random() - 0.5) * 0.02,
                    lng: location.lng + (Math.random() - 0.5) * 0.02,
                    title: `${location.name} #${i + 1}`,
                });
            }
        });
        return result;
    }, []);

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    🎯 {markers.length}개의 마커가 클러스터링되어 표시됩니다. 줌
                    인/아웃하면 마커들이 그룹화되는 것을 확인할 수 있습니다.
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
                style={{ width: "100%", height: "500px", borderRadius: "8px" }}
                clusterer={true}
            >
                {markers.map((marker, index) => (
                    <MapMarker
                        key={index}
                        position={marker}
                        title={marker.title}
                        // clustered prop 생략 - Map에 clusterer={true}가 있으면 자동으로 클러스터링됨
                        // 특정 마커를 제외하고 싶으면 clustered={false} 사용
                    />
                ))}
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
                    <span className="info-label">현재 줌 레벨:</span>
                    <span className="info-value">{level}</span>
                </div>
            </div>
        </div>
    );
}
