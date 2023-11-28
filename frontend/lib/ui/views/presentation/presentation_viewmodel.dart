import 'package:frontend/app/app.logger.dart';
import 'package:frontend/app/app.locator.dart';
import 'package:frontend/services/presentation_service.dart';
import 'package:stacked/stacked.dart';

class PresentationViewModel extends BaseViewModel {
  final logger = getLogger('PresentationViewModel');
  final _presentationService = locator<PresentationService>();
  final List<String> _images = [];

  Future<void> loadAllImages(code) async {
    final state = await _presentationService.getState(code);
    logger.i(state);
  }
}
