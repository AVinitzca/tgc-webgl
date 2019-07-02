
function AmmoStaticPlane(planeNormal, planeConstant, mass, transform)
{
    var shape = new Ammo.btStaticPlaneShape(planeNormal.toAmmoVector(), planeConstant);

    var bulletTransform = new Ammo.btTransform();
    bulletTransform.setFromOpenGLMatrix(transform);

    var groundLocalInertia = Vector3.Zero().toAmmoVector();
    var groundMotionState = new Ammo.btDefaultMotionState(transform);
    var constructionInfo = new Ammo.btRigidBodyConstructionInfo(mass, groundMotionState, shape, groundLocalInertia);

    return new Ammo.btRigidBody(constructionInfo);
}
