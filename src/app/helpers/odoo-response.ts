function odooParseBodyRequest(body: object) {
  return {
    params: {
      ...body
    }
  }

}

export {
  odooParseBodyRequest
}
