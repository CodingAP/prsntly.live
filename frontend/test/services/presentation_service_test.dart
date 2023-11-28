import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/app/app.locator.dart';

import '../helpers/test_helpers.dart';

void main() {
  group('PresentationServiceTest -', () {
    setUp(() => registerServices());
    tearDown(() => locator.reset());
  });
}
