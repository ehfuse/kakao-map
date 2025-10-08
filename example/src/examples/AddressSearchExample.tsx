import { Map, MapMarker, useKakaoMap } from "../../../src/KakaoMap";
import type { KakaoLatLng } from "../../../src/types";

interface SearchResult {
    address: string;
    roadAddress?: string;
    lat: number;
    lng: number;
}

// 비즈니스 로직 상태만 정의
interface AddressSearchExampleState {
    center: KakaoLatLng;
    level: number;
    address: string;
    searchResult: SearchResult | null;
    error: string;
    isSearching: boolean;
}

export function AddressSearchExample() {
    // useKakaoMap에서 state와 API 유틸리티를 함께 사용
    const {
        isReady,
        searchAddress: kakaoSearchAddress,
        state,
    } = useKakaoMap<AddressSearchExampleState>({
        stateId: "address-search-example",
        initialValues: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 3,
            address: "",
            searchResult: null,
            error: "",
            isSearching: false,
        },
    });

    const center = state.useValue("center") as KakaoLatLng;
    const level = state.useValue("level") as number;
    const address = state.useValue("address") as string;
    const searchResult = state.useValue("searchResult") as SearchResult | null;
    const error = state.useValue("error") as string;
    const isSearching = state.useValue("isSearching") as boolean;

    // 주소로 좌표 검색
    const searchAddress = async () => {
        if (!address.trim()) {
            state.setValue("error", "주소를 입력해주세요.");
            return;
        }

        if (!isReady) {
            state.setValue("error", "지도 API가 아직 로드되지 않았습니다.");
            return;
        }

        state.setValue("isSearching", true);
        state.setValue("error", "");
        state.setValue("searchResult", null);

        try {
            // useKakaoMap의 searchAddress 사용 (Promise 기반, 간단!)
            const result = await kakaoSearchAddress(address);

            state.setValue("searchResult", {
                address: result.address,
                roadAddress: result.roadAddress,
                lat: result.lat,
                lng: result.lng,
            });

            // 지도 중심을 검색된 위치로 이동
            state.setValue("center", { lat: result.lat, lng: result.lng });
        } catch (err) {
            state.setValue(
                "error",
                err instanceof Error
                    ? err.message
                    : "주소 검색 중 오류가 발생했습니다."
            );
        } finally {
            state.setValue("isSearching", false);
        }
    };

    // 인기 주소 예제
    const popularAddresses = [
        "서울 중구 세종대로 110",
        "서울 강남구 테헤란로 152",
        "서울 종로구 사직로 161",
        "서울 마포구 와우산로 29길 6",
        "부산 해운대구 해운대해변로 264",
    ];

    const handleExampleClick = (exampleAddress: string) => {
        state.setValue("address", exampleAddress);
        state.setValue("error", "");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchAddress();
        }
    };

    return (
        <div className="example-content">
            <div className="control-panel">
                <p className="description">
                    🔍 도로명 주소 또는 지번 주소를 입력하여 위치를 검색합니다.
                </p>

                <div style={{ marginBottom: "15px" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "8px",
                        }}
                    >
                        <input
                            type="text"
                            value={address}
                            onChange={(e) =>
                                state.setValue("address", e.target.value)
                            }
                            onKeyPress={handleKeyPress}
                            placeholder="예: 서울 중구 세종대로 110"
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                border: "2px solid #e0e0e0",
                                borderRadius: "6px",
                                fontSize: "14px",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = "#4285F4")
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor = "#e0e0e0")
                            }
                        />
                        <button
                            onClick={searchAddress}
                            disabled={isSearching}
                            style={{
                                padding: "10px 24px",
                                backgroundColor: isSearching
                                    ? "#ccc"
                                    : "#4285F4",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: isSearching ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (!isSearching)
                                    e.currentTarget.style.backgroundColor =
                                        "#3367D6";
                            }}
                            onMouseLeave={(e) => {
                                if (!isSearching)
                                    e.currentTarget.style.backgroundColor =
                                        "#4285F4";
                            }}
                        >
                            {isSearching ? "검색 중..." : "🔍 검색"}
                        </button>
                    </div>

                    {/* 예제 주소 버튼들 */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                marginRight: "4px",
                            }}
                        >
                            예제:
                        </span>
                        {popularAddresses.map((addr, index) => (
                            <button
                                key={index}
                                onClick={() => handleExampleClick(addr)}
                                style={{
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    backgroundColor: "#f1f3f4",
                                    color: "#5f6368",
                                    border: "1px solid #dadce0",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#e8eaed";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#f1f3f4";
                                }}
                            >
                                {addr.split(" ").slice(0, 3).join(" ")}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            padding: "12px",
                            backgroundColor: "#fee",
                            color: "#c33",
                            borderRadius: "6px",
                            fontSize: "14px",
                            marginBottom: "10px",
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                {searchResult && (
                    <div
                        style={{
                            padding: "12px",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "6px",
                            fontSize: "13px",
                            marginBottom: "10px",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                                marginBottom: "6px",
                                color: "#2e7d32",
                            }}
                        >
                            ✓ 검색 완료
                        </div>
                        <div style={{ color: "#555" }}>
                            <div>🏠 지번: {searchResult.address}</div>
                            {searchResult.roadAddress && (
                                <div>🛣️ 도로명: {searchResult.roadAddress}</div>
                            )}
                            <div>
                                📍 좌표: {searchResult.lat.toFixed(6)},{" "}
                                {searchResult.lng.toFixed(6)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Map
                center={center}
                level={level}
                style={{ width: "100%", height: "500px", borderRadius: "8px" }}
            >
                {searchResult && (
                    <MapMarker
                        position={{
                            lat: searchResult.lat,
                            lng: searchResult.lng,
                        }}
                        title={searchResult.roadAddress || searchResult.address}
                        clickable={true}
                    />
                )}
            </Map>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">검색 상태:</span>
                    <span className="info-value">
                        {isSearching
                            ? "🔄 검색 중..."
                            : searchResult
                            ? "✓ 검색 완료"
                            : "⏸️ 대기 중"}
                    </span>
                </div>
                {searchResult && (
                    <>
                        <div className="info-item">
                            <span className="info-label">현재 위치:</span>
                            <span className="info-value">
                                {searchResult.roadAddress ||
                                    searchResult.address}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">좌표:</span>
                            <span className="info-value">
                                {searchResult.lat.toFixed(6)},{" "}
                                {searchResult.lng.toFixed(6)}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
