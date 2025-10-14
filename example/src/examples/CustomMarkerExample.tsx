import { Map, MapMarker } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";
import { type ReactElement } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import {
    NumberedMarker,
    StarMarker,
    HeartMarker,
    CustomIconMarker,
} from "../components/MarkerIcons";

interface MarkerData {
    id: number;
    position: { lat: number; lng: number };
    label: string;
    imageData: string | ReactElement; // imageType은 자동으로 감지
}

// 비즈니스 로직 상태만 정의
interface CustomMarkerExampleState {
    center: KakaoLatLng;
    level: number;
    selectedMarkerId: number | null;
}

export function CustomMarkerExample() {
    const state = useGlobalFormaState<CustomMarkerExampleState>({
        stateId: "custom-marker-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 5,
            selectedMarkerId: null,
        },
    });

    const center = state.useValue("center") as KakaoLatLng;
    const level = state.useValue("level") as number;
    const selectedMarkerId = state.useValue("selectedMarkerId") as
        | number
        | null;

    // SVG 문자열을 Data URL로 변환하는 함수
    const svgToDataUrl = (svgString: string) => {
        return `data:image/svg+xml;base64,${btoa(svgString)}`;
    };

    // SVG 문자열 생성 함수 (레거시)
    const createNumberedMarkerSvg = (
        number: number,
        color: string = "#2196f3"
    ) => {
        return `<svg width="36" height="36" viewBox="1 1 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="25.0" rx="2.3" ry="0.8" fill="rgba(0, 0, 0, 0.3)"></ellipse>
            <path d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 25C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z" fill="${color}"></path>
            <text x="12" y="14" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="Arial, sans-serif" font-weight="bold">${number}</text>
        </svg>`;
    };

    // 타입 자동 감지 함수
    const getImageType = (
        imageData: string | ReactElement
    ): "svg" | "url" | "reactNode" => {
        if (typeof imageData === "string") {
            if (imageData.startsWith("http") || imageData.startsWith("//")) {
                return "url";
            }
            return "svg";
        }
        return "reactNode";
    };

    // 예제 마커 데이터 - imageType 제거, 자동 감지
    const markers: MarkerData[] = [
        {
            id: 1,
            position: { lat: 37.5665, lng: 126.978 }, // 서울시청
            label: "SVG 문자열 마커 #1",
            imageData: createNumberedMarkerSvg(1, "#2196f3"),
        },
        {
            id: 2,
            position: { lat: 37.5651, lng: 126.975 },
            label: "React 컴포넌트 마커 (숫자)",
            imageData: <NumberedMarker number={2} color="#f44336" />,
        },
        {
            id: 3,
            position: { lat: 37.568, lng: 126.981 },
            label: "React 컴포넌트 마커 (별)",
            imageData: <StarMarker />,
        },
        {
            id: 4,
            position: { lat: 37.564, lng: 126.98 },
            label: "이미지 URL 마커",
            imageData:
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
        },
        {
            id: 5,
            position: { lat: 37.567, lng: 126.976 },
            label: "React 컴포넌트 마커 (하트)",
            imageData: <HeartMarker />,
        },
        {
            id: 6,
            position: { lat: 37.5625, lng: 126.9765 },
            label: "React 컴포넌트 마커 (커스텀)",
            imageData: <CustomIconMarker icon="🏠" color="#ff9800" />,
        },
    ];

    return (
        <div className="example-content">
            <div className="control-panel">
                <h3 style={{ marginTop: 0, color: "#333" }}>
                    🎨 커스텀 마커 이미지 예제
                </h3>
                <p className="description">
                    지도의 마커를 클릭하면 선택 상태가 변경되고 마커 크기가
                    커집니다.
                </p>

                <div style={{ marginTop: "24px" }}>
                    <h4 style={{ color: "#495057", marginBottom: "16px" }}>
                        📍 마커 목록
                    </h4>
                    <div
                        style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef",
                        }}
                    >
                        {markers.map((marker) => {
                            const imageType = getImageType(marker.imageData);
                            return (
                                <div
                                    key={marker.id}
                                    style={{
                                        padding: "12px",
                                        marginBottom: "8px",
                                        borderRadius: "6px",
                                        backgroundColor:
                                            selectedMarkerId === marker.id
                                                ? "#e3f2fd"
                                                : "#f8f9fa",
                                        border:
                                            selectedMarkerId === marker.id
                                                ? "2px solid #2196f3"
                                                : "1px solid #e9ecef",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            <strong
                                                style={{
                                                    color:
                                                        selectedMarkerId ===
                                                        marker.id
                                                            ? "#2196f3"
                                                            : "#333",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {marker.label}
                                            </strong>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                타입:{" "}
                                                {imageType === "svg"
                                                    ? "📝 SVG 문자열"
                                                    : imageType === "reactNode"
                                                    ? "⚛️ React 컴포넌트"
                                                    : "🖼️ 이미지 URL"}{" "}
                                                (자동 감지)
                                            </div>
                                        </div>
                                        {selectedMarkerId === marker.id && (
                                            <span
                                                style={{
                                                    color: "#2196f3",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    padding: "4px 8px",
                                                    backgroundColor: "white",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                ✓ 선택됨
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "24px",
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                    }}
                >
                    <h4
                        style={{
                            color: "#495057",
                            marginTop: 0,
                            marginBottom: "16px",
                        }}
                    >
                        💡 사용 방법
                    </h4>
                    <div
                        style={{
                            fontSize: "14px",
                            lineHeight: "1.8",
                            color: "#495057",
                        }}
                    >
                        <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#333" }}>
                                1. React SVG 컴포넌트 사용 (권장):
                            </strong>
                            <pre
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "12px",
                                    borderRadius: "6px",
                                    overflow: "auto",
                                    fontSize: "12px",
                                    marginTop: "8px",
                                    border: "1px solid #e9ecef",
                                    color: "#333",
                                }}
                            >
                                {`import { NumberedMarker } from "./components/MarkerIcons";

<MapMarker
  position={{ lat: 37.5665, lng: 126.978 }}
  image={{
    src: <NumberedMarker number={1} color="#2196f3" />,
    size: { width: 36, height: 36 }
  }}
/>`}
                            </pre>
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                            <strong style={{ color: "#333" }}>
                                2. SVG 문자열 사용:
                            </strong>
                            <pre
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "12px",
                                    borderRadius: "6px",
                                    overflow: "auto",
                                    fontSize: "12px",
                                    marginTop: "8px",
                                    border: "1px solid #e9ecef",
                                    color: "#333",
                                }}
                            >
                                {`const svgString = '<svg>...</svg>';

<MapMarker
  position={{ lat: 37.5665, lng: 126.978 }}
  image={{
    src: svgToDataUrl(svgString),
    size: { width: 36, height: 36 }
  }}
/>`}
                            </pre>
                        </div>
                        <div>
                            <strong style={{ color: "#333" }}>
                                3. 이미지 URL 사용:
                            </strong>
                            <pre
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "12px",
                                    borderRadius: "6px",
                                    overflow: "auto",
                                    fontSize: "12px",
                                    marginTop: "8px",
                                    border: "1px solid #e9ecef",
                                    color: "#333",
                                }}
                            >
                                {`<MapMarker
  position={{ lat: 37.5665, lng: 126.978 }}
  image={{
    src: "https://example.com/marker.png",
    size: { width: 64, height: 69 }
  }}
/>`}
                            </pre>
                        </div>
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "12px",
                                backgroundColor: "#e3f2fd",
                                borderRadius: "6px",
                                fontSize: "13px",
                            }}
                        >
                            <strong style={{ color: "#1976d2" }}>💡 팁:</strong>{" "}
                            imageType을 직접 지정할 필요 없이 라이브러리가
                            자동으로 타입을 감지합니다!
                        </div>
                    </div>
                </div>

                <div
                    className="button-group"
                    style={{ marginTop: "20px", justifyContent: "center" }}
                >
                    <button
                        onClick={() => state.setValue("selectedMarkerId", null)}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#d32f2f";
                            e.currentTarget.style.transform =
                                "translateY(-1px)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#f44336";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        🔄 선택 해제
                    </button>
                </div>
            </div>

            <Map
                center={center}
                level={level}
                style={{
                    borderRadius: "8px",
                    marginTop: "24px",
                }}
            >
                {markers.map((marker) => {
                    const isSelected = selectedMarkerId === marker.id;
                    const scale = isSelected ? 1.3 : 1;
                    const imageType = getImageType(marker.imageData);

                    // 이미지 소스 처리 - 타입에 따라 자동 변환
                    let imageSrc: string | ReactElement;
                    if (imageType === "svg") {
                        // SVG 문자열인 경우 Data URL로 변환
                        imageSrc = svgToDataUrl(marker.imageData as string);
                    } else {
                        // ReactElement 또는 URL인 경우 그대로 사용
                        imageSrc = marker.imageData as string | ReactElement;
                    }

                    return (
                        <MapMarker
                            key={marker.id}
                            position={marker.position}
                            image={{
                                src: imageSrc,
                                size: {
                                    width:
                                        imageType === "url" ? 64 : 36 * scale,
                                    height:
                                        imageType === "url" ? 69 : 36 * scale,
                                },
                            }}
                            onClick={() => {
                                state.setValue(
                                    "selectedMarkerId",
                                    isSelected ? null : marker.id
                                );
                            }}
                        />
                    );
                })}
            </Map>
        </div>
    );
}
