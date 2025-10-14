# 예제

## 목차

-   [기본 예제](#기본-예제) - 간단한 지도, 마커 표시, 여러 마커
-   [마커 클러스터링](#마커-클러스터링) - 많은 마커를 효율적으로 표시
-   [인터랙티브 마커](#인터랙티브-마커) - 클릭 이벤트, 드래그 가능 마커
-   [InfoWindow (정보창)](#infowindow-정보창) - 기본 정보창과 CustomInfoWindow
-   [CustomOverlay](#customoverlay) - 커스텀 오버레이 표시
-   [커스텀 마커 이미지](#커스텀-마커-이미지) - URL, SVG, React 컴포넌트로 마커 커스터마이징
-   [주소 검색](#주소-검색) - 주소로 좌표 찾기, 좌표로 주소 찾기
-   [상태 관리와 통합](#상태-관리와-통합) - forma와 통합한 상태 관리
-   [지도 컨트롤](#지도-컨트롤) - 줌 컨트롤, 지도 타입 컨트롤
-   [더 많은 예제](#더-많은-예제) - GitHub 저장소의 추가 예제

---

## 기본 예제

### 1. 간단한 지도

```tsx
import { Map } from "@ehfuse/kakao-map";

function BasicMap() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        />
    );
}
```

### 2. 마커 표시

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function MarkerExample() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        >
            <MapMarker
                position={{ lat: 37.5665, lng: 126.978 }}
                title="서울시청"
            />
        </Map>
    );
}
```

### 3. 여러 마커

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function MultipleMarkers() {
    const places = [
        { lat: 37.5665, lng: 126.978, name: "서울시청" },
        { lat: 37.5794, lng: 126.977, name: "경복궁" },
        { lat: 37.5512, lng: 126.9882, name: "명동" },
    ];

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={5}
            style={{ width: "100%", height: "400px" }}
        >
            {places.map((place, index) => (
                <MapMarker key={index} position={place} title={place.name} />
            ))}
        </Map>
    );
}
```

---

## 마커 클러스터링

많은 마커를 효율적으로 표시할 수 있습니다.

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";
import { useMemo } from "react";

function ClusterExample() {
    // 100개의 랜덤 마커 생성
    const markers = useMemo(() => {
        const baseCenter = { lat: 37.5665, lng: 126.978 };
        return Array.from({ length: 100 }, (_, i) => ({
            id: i,
            lat: baseCenter.lat + (Math.random() - 0.5) * 0.1,
            lng: baseCenter.lng + (Math.random() - 0.5) * 0.1,
        }));
    }, []);

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={7}
            style={{ width: "100%", height: "500px" }}
            clusterer={true} // 클러스터링 활성화
        >
            {markers.map((marker) => (
                <MapMarker key={marker.id} position={marker} />
            ))}
        </Map>
    );
}
```

### 특정 마커만 클러스터에서 제외

```tsx
function ClusterWithMyLocation() {
    const myLocation = { lat: 37.5665, lng: 126.978 };
    const otherMarkers = [...]; // 다른 마커들

    return (
        <Map clusterer={true}>
            {/* 일반 마커들은 클러스터링 */}
            {otherMarkers.map((marker) => (
                <MapMarker key={marker.id} position={marker} />
            ))}

            {/* 내 위치는 항상 개별 표시 */}
            <MapMarker
                position={myLocation}
                clustered={false}
                image={{
                    src: '//path/to/my-location-icon.png',
                    size: { width: 40, height: 40 }
                }}
            />
        </Map>
    );
}
```

---

## 인터랙티브 마커

### 클릭 가능한 마커

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";
import { useState } from "react";

function ClickableMarker() {
    const [selectedId, setSelectedId] = useState(null);

    const places = [
        { id: 1, lat: 37.5665, lng: 126.978, name: "서울시청" },
        { id: 2, lat: 37.5794, lng: 126.977, name: "경복궁" },
        { id: 3, lat: 37.5512, lng: 126.9882, name: "명동" },
    ];

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={5}
            style={{ width: "100%", height: "400px" }}
        >
            {places.map((place) => (
                <MapMarker
                    key={place.id}
                    position={place}
                    title={place.name}
                    onClick={() => setSelectedId(place.id)}
                    opacity={selectedId === place.id ? 1 : 0.5}
                />
            ))}
        </Map>
    );
}
```

### 드래그 가능한 마커

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";
import { useState } from "react";

function DraggableMarker() {
    const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });

    return (
        <div>
            <p>마커를 드래그해보세요!</p>
            <p>
                현재 위치: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>

            <Map
                center={position}
                level={3}
                style={{ width: "100%", height: "400px" }}
            >
                <MapMarker
                    position={position}
                    draggable={true}
                    onDragEnd={(marker) => {
                        const pos = marker.getPosition();
                        setPosition({ lat: pos.getLat(), lng: pos.getLng() });
                    }}
                />
            </Map>
        </div>
    );
}
```

---

## InfoWindow (정보창)

### 기본 InfoWindow

```tsx
import { Map, MapMarker, InfoWindow } from "@ehfuse/kakao-map";
import { useState } from "react";

function InfoWindowExample() {
    const [selectedId, setSelectedId] = useState(null);

    const places = [
        {
            id: 1,
            lat: 37.5665,
            lng: 126.978,
            name: "서울시청",
            desc: "서울특별시청",
        },
        {
            id: 2,
            lat: 37.5794,
            lng: 126.977,
            name: "경복궁",
            desc: "조선시대 법궁",
        },
    ];

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={4}
            style={{ width: "100%", height: "400px" }}
        >
            {places.map((place) => (
                <MapMarker
                    key={place.id}
                    position={place}
                    onClick={() => setSelectedId(place.id)}
                >
                    {selectedId === place.id && (
                        <InfoWindow
                            removable={true}
                            onCloseClick={() => setSelectedId(null)}
                        >
                            <div style={{ padding: "10px" }}>
                                <h3>{place.name}</h3>
                                <p>{place.desc}</p>
                            </div>
                        </InfoWindow>
                    )}
                </MapMarker>
            ))}
        </Map>
    );
}
```

---

## CustomOverlay

### 커스텀 디자인 오버레이

```tsx
import { Map, CustomOverlayMap } from "@ehfuse/kakao-map";

function CustomOverlayExample() {
    const places = [
        { lat: 37.5665, lng: 126.978, name: "서울시청", color: "#4285F4" },
        { lat: 37.5794, lng: 126.977, name: "경복궁", color: "#EA4335" },
        { lat: 37.5512, lng: 126.9882, name: "명동", color: "#FBBC04" },
    ];

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={5}
            style={{ width: "100%", height: "400px" }}
        >
            {places.map((place, index) => (
                <CustomOverlayMap key={index} position={place} yAnchor={1}>
                    <div
                        style={{
                            padding: "8px 12px",
                            background: place.color,
                            color: "white",
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        {place.name}
                    </div>
                </CustomOverlayMap>
            ))}
        </Map>
    );
}
```

---

## 커스텀 마커 이미지

### URL 이미지

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function CustomImageMarker() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        >
            <MapMarker
                position={{ lat: 37.5665, lng: 126.978 }}
                image={{
                    src: "https://example.com/marker-icon.png",
                    size: { width: 40, height: 40 },
                    options: {
                        offset: { x: 20, y: 40 }, // 하단 중앙이 마커 위치
                    },
                }}
            />
        </Map>
    );
}
```

### React SVG 컴포넌트

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

// SVG 마커 컴포넌트
function NumberedMarker({ number, color = "#2196f3" }) {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24">
            <ellipse cx="12" cy="23" rx="2.3" ry="0.8" fill="rgba(0,0,0,0.3)" />
            <path
                d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 24C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z"
                fill={color}
            />
            <text
                x="12"
                y="13"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
            >
                {number}
            </text>
        </svg>
    );
}

function CustomSVGMarker() {
    const places = [
        { id: 1, lat: 37.5665, lng: 126.978, name: "서울시청" },
        { id: 2, lat: 37.5794, lng: 126.977, name: "경복궁" },
        { id: 3, lat: 37.5512, lng: 126.9882, name: "명동" },
    ];

    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={5}
            style={{ width: "100%", height: "400px" }}
        >
            {places.map((place, index) => (
                <MapMarker
                    key={place.id}
                    position={place}
                    image={{
                        src: (
                            <NumberedMarker
                                number={index + 1}
                                color="#ff0000"
                            />
                        ),
                        size: { width: 36, height: 36 },
                    }}
                />
            ))}
        </Map>
    );
}
```

---

## 주소 검색

### useKakaoMap으로 주소 검색

```tsx
import { Map, MapMarker, useKakaoMap } from "@ehfuse/kakao-map";
import { useState } from "react";

// 주소 검색 상태 타입 정의
interface AddressSearchState {
    center: { lat: number; lng: number };
    level: number;
    markerPosition: { lat: number; lng: number } | null;
    searchResult: {
        address: string;
        roadAddress?: string;
        lat: number;
        lng: number;
    } | null;
}

function AddressSearchExample() {
    const { searchAddress, state } = useKakaoMap<AddressSearchState>({
        stateId: "address-search",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 3,
            markerPosition: null,
            searchResult: null,
        },
    });

    const center = state.useValue("center");
    const level = state.useValue("level");
    const markerPosition = state.useValue("markerPosition");
    const searchResult = state.useValue("searchResult");

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!address.trim()) return;

        setLoading(true);
        try {
            const result = await searchAddress(address);
            if (result) {
                state.setValues({
                    center: { lat: result.lat, lng: result.lng },
                    markerPosition: { lat: result.lat, lng: result.lng },
                    searchResult: result,
                    level: 3,
                });
            }
        } catch (error) {
            alert("주소를 찾을 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="주소를 입력하세요 (예: 서울시청)"
                    style={{ width: "300px", padding: "8px" }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "검색 중..." : "검색"}
                </button>
            </form>

            {searchResult && (
                <div
                    style={{
                        marginBottom: "10px",
                        padding: "10px",
                        background: "#f0f0f0",
                    }}
                >
                    <p>
                        <strong>주소:</strong> {searchResult.address}
                    </p>
                    {searchResult.roadAddress && (
                        <p>
                            <strong>도로명:</strong> {searchResult.roadAddress}
                        </p>
                    )}
                    <p>
                        <strong>좌표:</strong> {searchResult.lat.toFixed(6)},{" "}
                        {searchResult.lng.toFixed(6)}
                    </p>
                </div>
            )}

            <Map
                center={center}
                level={level}
                style={{ width: "100%", height: "400px" }}
            >
                {markerPosition && <MapMarker position={markerPosition} />}
            </Map>
        </div>
    );
}
```

---

## 상태 관리와 통합

### 비즈니스 로직 상태 분리

```tsx
import { Map, MapMarker, useKakaoMap } from "@ehfuse/kakao-map";

interface MyAppState {
    center: { lat: number; lng: number };
    level: number;
    markers: Array<{ id: number; lat: number; lng: number; name: string }>;
    selectedMarkerId: number | null;
}

function MyApp() {
    const { state } = useKakaoMap<MyAppState>({
        stateId: "my-app",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 5,
            markers: [
                { id: 1, lat: 37.5665, lng: 126.978, name: "서울시청" },
                { id: 2, lat: 37.5794, lng: 126.977, name: "경복궁" },
            ],
            selectedMarkerId: null,
        },
    });

    const center = state.useValue("center");
    const level = state.useValue("level");
    const markers = state.useValue("markers");
    const selectedMarkerId = state.useValue("selectedMarkerId");

    return (
        <Map
            center={center}
            level={level}
            style={{ width: "100%", height: "400px" }}
        >
            {markers.map((marker) => (
                <MapMarker
                    key={marker.id}
                    position={marker}
                    title={marker.name}
                    onClick={() =>
                        state.setValue("selectedMarkerId", marker.id)
                    }
                    opacity={selectedMarkerId === marker.id ? 1 : 0.6}
                />
            ))}
        </Map>
    );
}
```

---

## 지도 컨트롤

### 줌 컨트롤과 지도 타입 컨트롤

```tsx
import { Map } from "@ehfuse/kakao-map";

function MapWithControls() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
            zoomControl={true}
            zoomControlPosition="RIGHT"
            mapTypeControl={true}
            mapTypeControlPosition="TOPRIGHT"
        />
    );
}
```

### 교통정보와 지형정보

```tsx
import { Map } from "@ehfuse/kakao-map";
import { useState } from "react";

function MapWithLayers() {
    const [traffic, setTraffic] = useState(false);
    const [terrain, setTerrain] = useState(false);

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={traffic}
                        onChange={(e) => setTraffic(e.target.checked)}
                    />
                    교통정보
                </label>
                <label style={{ marginLeft: "10px" }}>
                    <input
                        type="checkbox"
                        checked={terrain}
                        onChange={(e) => setTerrain(e.target.checked)}
                    />
                    지형정보
                </label>
            </div>

            <Map
                center={{ lat: 37.5665, lng: 126.978 }}
                level={3}
                style={{ width: "100%", height: "400px" }}
                traffic={traffic}
                terrain={terrain}
            />
        </div>
    );
}
```

---

## 더 많은 예제

전체 예제 코드는 [GitHub 저장소의 example 폴더](https://github.com/ehfuse/kakao-map/tree/main/example)에서 확인할 수 있습니다.

-   [BasicExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/BasicExample.tsx) - 기본 기능 데모
-   [ClusterExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/ClusterExample.tsx) - 마커 클러스터링
-   [InfoWindowExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/InfoWindowExample.tsx) - 정보창
-   [CustomOverlayExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/CustomOverlayExample.tsx) - 커스텀 오버레이
-   [CustomMarkerExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/CustomMarkerExample.tsx) - 커스텀 마커
-   [AddressSearchExample.tsx](https://github.com/ehfuse/kakao-map/blob/main/example/src/examples/AddressSearchExample.tsx) - 주소 검색
