export class ClientDTO {
  client_id;
  resource_ids;
  client_secret;
  scopes;
  authorized_grant_types;
  web_server_redirect_uri;

  access_token_validity;
  refresh_token_validity;
  //这是一个预留的字段,在Oauth的流程中没有实际的使用,可选,但若设置值,必须是JSON格式的数据
  additional_information;
  is_locked;
}
