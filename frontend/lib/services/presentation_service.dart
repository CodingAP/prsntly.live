import 'dart:convert';
import 'package:frontend/model/json_types.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:frontend/app/app.logger.dart';

class PresentationService {
  final logger = getLogger('PresentationService');

  Future<bool> validateCode(String code) async {
    String apiRoute = dotenv.get('API_ROUTE');
    final response =
        await http.get(Uri.https(apiRoute, '/presentations/$code'));
    return (response.statusCode == 200);
  }

  Future<PresentationState?> getState(String code) async {
    String apiRoute = dotenv.get('API_ROUTE');
    final response =
        await http.get(Uri.https(apiRoute, '/presentations/$code'));

    if (response.statusCode == 200) {
      return PresentationState.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }
}
