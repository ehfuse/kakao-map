# 시작하기

## 설치

```bash
npm install @ehfuse/kakao-map
# or
yarn add @ehfuse/kakao-map
# or
pnpm add @ehfuse/kakao-map
```

## Kakao API 키 발급

1. [Kakao Developers](https://developers.kakao.com/)에 접속하여 로그인
2. "내 애플리케이션" 메뉴에서 애플리케이션 추가
3. "플랫폼" → "Web" 추가
4. "JavaScript 키" 복사

## 기본 사용법

### 1. HTML에 스크립트 추가 (권장)

`index.html` 파일에 Kakao Maps SDK를 추가합니다:

```html
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Kakao Map App</title>
        <!-- Kakao Maps SDK -->
        <script
            type="text/javascript"
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services,clusterer,drawing"
        ></script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

### 2. 간단한 지도 표시

```tsx
import { Map } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        />
    );
}

export default App;
```

### 3. 마커 추가

```tsx
import { Map, MapMarker } from "@ehfuse/kakao-map";

function App() {
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

## 동적 API 키 설정 (선택사항)

HTML에 스크립트를 추가하지 않고 동적으로 API 키를 설정할 수도 있습니다:

```tsx
import { Map } from "@ehfuse/kakao-map";

function App() {
    return (
        <Map
            apiKey="YOUR_APP_KEY"
            center={{ lat: 37.5665, lng: 126.978 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
        />
    );
}
```

> ⚠️ 프로덕션 환경에서는 HTML에 스크립트를 추가하는 방식을 권장합니다.

## useKakaoMap 훅 사용

지도 기능과 상태 관리를 위해 `useKakaoMap` 훅을 사용할 수 있습니다:

```tsx
import { Map, MapMarker, useKakaoMap } from "@ehfuse/kakao-map";

// 비즈니스 로직 상태 타입 정의
interface MyMapState {
    selectedPlace: { lat: number; lng: number; name: string } | null;
    searchKeyword: string;
}

function App() {
    const { map, state, searchAddress } = useKakaoMap<MyMapState>({
        stateId: "my-map",
        initialValues: {
            selectedPlace: null,
            searchKeyword: "",
        },
    });

    const selectedPlace = state.useValue("selectedPlace");

    const handleSearch = async () => {
        const result = await searchAddress("서울시청");
        if (result) {
            state.setValue("selectedPlace", {
                lat: result.lat,
                lng: result.lng,
                name: "서울시청",
            });
        }
    };

    return (
        <div>
            <button onClick={handleSearch}>서울시청 찾기</button>
            <Map
                center={
                    selectedPlace
                        ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
                        : { lat: 37.5665, lng: 126.978 }
                }
                level={3}
                style={{ width: "100%", height: "400px" }}
            >
                {selectedPlace && (
                    <MapMarker
                        position={{
                            lat: selectedPlace.lat,
                            lng: selectedPlace.lng,
                        }}
                        title={selectedPlace.name}
                    />
                )}
            </Map>
        </div>
    );
}
```

## 다음 단계

-   [API 레퍼런스](./api.md) - 모든 컴포넌트와 훅의 상세 API
-   [예제](./examples.md) - 다양한 사용 예제
-   [GitHub 저장소](https://github.com/ehfuse/kakao-map) - 소스 코드 및 이슈

## 문제 해결

### API 로드 오류

```
Uncaught ReferenceError: kakao is not defined
```

→ `index.html`에 Kakao Maps SDK 스크립트가 추가되었는지 확인하세요.

### TypeScript 오류

컴포넌트의 모든 props에 대한 타입 정의가 제공됩니다. IDE의 자동 완성을 활용하세요.

```tsx
import type { MapProps, MapMarkerProps } from "@ehfuse/kakao-map";
```
