import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../theme/ivory_theme.dart';

/// The proof picker's one true road, walked by the phone and the
/// browser alike: pick an image, answer its bytes. The phone reads
/// them off disk; the browser reads them out of memory.
Future<Uint8List?> pickProofBytes() async {
  final ImagePicker picker = ImagePicker();
  final XFile? x = await picker.pickImage(
    source: ImageSource.gallery,
    imageQuality: 70,
    maxWidth: 1400,
  );
  if (x == null) return null;
  return await x.readAsBytes();
}


/// The attach tile itself, lifted out of the checkout screen so the
/// screen stays light and the tile stays one honest row.
class ProofAttachTile extends StatelessWidget {
  const ProofAttachTile({
    super.key,
    required this.attached,
    required this.onTap,
    required this.onRemove,
  });

  final bool attached;
  final VoidCallback onTap;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: IvoryColors.surfaceWarm,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: IvoryColors.hairlineStrong),
        ),
        child: Row(
          children: <Widget>[
            Icon(
              attached
                  ? Icons.check_circle
                  : Icons.add_photo_alternate_outlined,
              color: attached ? IvoryColors.success : IvoryColors.plum,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                attached
                    ? 'Screenshot attached'
                    : 'Attach the receipt screenshot (optional)',
                style: TextStyle(
                  color:
                      attached ? IvoryColors.burgundy : IvoryColors.textSoft,
                  fontSize: 13.5,
                  fontWeight: attached ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ),
            if (attached)
              TextButton(
                onPressed: onRemove,
                child: const Text('Remove'),
              ),
          ],
        ),
      ),
    );
  }
}

// END OF FILE - lib/screens/checkout_proof.dart
