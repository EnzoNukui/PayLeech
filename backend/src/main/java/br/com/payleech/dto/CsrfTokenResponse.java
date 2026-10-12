package br.com.payleech.dto;

public class CsrfTokenResponse {

    private String token;
    private String headerName;

    public CsrfTokenResponse(String token, String headerName) {
        this.token = token;
        this.headerName = headerName;
    }

    public String getToken() {
        return token;
    }

    public String getHeaderName() {
        return headerName;
    }
}
